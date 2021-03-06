# Setting up
setwd("~/Documents/Graduate Files/InvertedScenes/invertedScenes-main/Lists")
library(tidyverse)

# Defining input data
main_list = read.csv("rb01_list.csv")
conditions = c("basic.Inconsistent.Yes.50",
               "super.Inconsistent.Yes.50",
               "consistent.Consistent.Yes.50",
               "consistent.Consistent.Yes.50",
               "basic.Inconsistent.No.50",
               "super.Inconsistent.No.50",
               "consistent.Consistent.No.50",
               "consistent.Consistent.No.50",
               "basic.Inconsistent.Yes.100",
               "super.Inconsistent.Yes.100",
               "consistent.Consistent.Yes.100",
               "consistent.Consistent.Yes.100",
               "basic.Inconsistent.No.100",
               "super.Inconsistent.No.100",
               "consistent.Consistent.No.100",
               "consistent.Consistent.No.100",
               "basic.Inconsistent.Yes.150",
               "super.Inconsistent.Yes.150",
               "consistent.Consistent.Yes.150",
               "consistent.Consistent.Yes.150",
               "basic.Inconsistent.No.150",
               "super.Inconsistent.No.150",
               "consistent.Consistent.No.150",
               "consistent.Consistent.No.150")

# Removing practice input data
main_list = main_list[!main_list$Basic == "Practice",]

# Helper functions
## Creating condition data.frame
make_con_df = function(conditions) {
  con_df = data.frame(x=1:length(conditions))
  for (i in 1:length(conditions)) {
    conditions = c(conditions[-1], conditions[1])
    con_vec = c()
    for (condition in 1:length(conditions)) {
      con_vec = c(con_vec, rep(conditions[condition], round(nrow(main_list))/length(conditions)))
    }
    con_df = data.frame(con_df, condition = con_vec)
  }
  con_df$x = NULL
  names(con_df) = letters[1:length(conditions)]
  return(con_df)
}

## Randomization functions
custom_scramble = function(input_df, scope, maxrep) {
  flag = FALSE
  df = input_df
  while (!flag) {
    df = scramble(input_df)
    flag = check_repeat(df$Basic, 5, 3)
  }
  return(df)
}

check_repeat = function(array, scope, maxrep) {
  scope = scope - 1
  flag = FALSE
  for (i in 1:(length(array)-scope)) {
    check = array[i:(i+scope)]
    if (max(table(check)) > maxrep) {
      flag = TRUE
      return(flag)
    }
  }
  return(flag)
}

scramble = function(df) {
  return(df[sample(1:nrow(df)),])
}

# Main functions
## Function hierarchy: make_latin_squares > make_all_conditions > make_condition > assign_objects

make_latin_squares = function(main_list, conditions) {
  con_df = make_con_df(conditions)
  main_list = cbind(main_list)
  output = NULL
  attempt = 1
  while( is.null(output) && attempt <= 100 ) {
    attempt = attempt + 1
    try(
      output <- make_all_conditions(main_list, con_df)
    )
  } 
  return(output)
}

make_all_conditions = function(main_list, con_df) {
  main_list = custom_scramble(main_list, 5, 1)
  con_names = names(con_df)
  for (i in 1:length(con_names)) {
    con_vec = con_df[,c(con_names[i])]
    con_data = make_condition(main_list, con_vec)
    con_vec = con_data$Object
    main_list[,c(con_names[i])] = con_vec
    main_list[,LETTERS[i]] = con_data$condition
  }
  return(main_list)
}

make_condition = function(main_list, con_vec) {
  go = TRUE
  counter = 1
  while (go & counter < 20) {
    con_df = data.frame(x=con_vec)
    con_df = separate(con_df, x, c("consistency_category", "Consistent", "Inverted", "Duration"))
    
    df1 = cbind(main_list, con_df)
    df1 = assign_objects(df1)
    diff_crit = abs(table(df1$consistency_category)[1] - table(df1$consistency_category)[3])
    if (all(apply(df1, 2, function(x) any(is.na(x)))==FALSE)&diff_crit==0) {
      go = FALSE
      print(table(df1$consistency_category))
      df1 = unite(df1, "condition", consistency_category, Consistent, Inverted, Duration, sep = ".")
      return(df1[,c("Object", "condition")])
    } else {
      counter = counter + 1 
      if (counter > 20) {
        break
      }
    }
  }
  stop("Reached iteration limit (20); Trying again.")
}

assign_objects = function(df1) {
  probe_df = df1[df1$Consistent == "Consistent",]
  idx = sample(1:nrow(df1))
  df1 = df1[idx,]
  for (i in 1:nrow(df1)) {
    if (df1[i, c("Consistent")] != "Consistent") {
      if (df1[i, c("consistency_category")] == "basic") {
        eligible = probe_df[probe_df$Basic!=df1[i, c("Basic")]&probe_df$Supersuperordinate==df1[i, c("Supersuperordinate")],]
        if (nrow(eligible) > 0) {
          eligible = scramble(eligible)
          df1[i, c("Object")] = eligible[1,c("Object")]
          probe_df = probe_df[!(probe_df$Object==eligible[1,c("Object")]),]
        } else {
          nobasic = probe_df[probe_df$Basic!=df1[i, c("Basic")],]
          nobasic = scramble(nobasic)
          df1[i, c("Object")] = nobasic[1,c("Object")]
          df1[i, c("consistency_category")] = "super"
          probe_df = probe_df[!(probe_df$Object==nobasic[1,c("Object")]),]
        }
      } else {
        eligible = probe_df[probe_df$Supersuperordinate!=df1[i, c("Supersuperordinate")],]
        if (nrow(eligible) > 0) {
          eligible = scramble(eligible)
          df1[i, c("Object")] = eligible[1,c("Object")]
          probe_df = probe_df[!(probe_df$Object==eligible[1,c("Object")]),]
        } else {
          nobasic = probe_df[probe_df$Basic!=df1[i, c("Basic")],]
          nobasic = scramble(nobasic)
          df1[i, c("Object")] = nobasic[1,c("Object")]
          df1[i, c("consistency_category")] = "basic"
          probe_df = probe_df[!(probe_df$Object==nobasic[1,c("Object")]),]
        }
      } 
    }
  }
  df1[idx,] = df1
  return(df1)
}

# Executing function and storing latin square data as data.frame
output = make_latin_squares(main_list, conditions)
write.csv(output, "rb01_full_conditions.csv")

# Save conditions as separate files
saveConditionsAsFiles = function(df, conditions) {
  df = df[order(df$SceneImage),]
  for (i in 1:length(conditions)) {
    object_vec = df[,letters[i]]
    full_con = df[,LETTERS[i]]
    current_df = cbind(df$SceneImage, object_vec)
    colnames(current_df) = c("SceneImage", "Object")
    current_df = cbind(current_df, full_con)
    current_df = as.data.frame(current_df)
    current_df = separate(current_df, full_con, c("consistency_category", "Consistent", "Inverted", "Duration"))
    filename = paste("rb01_condition", LETTERS[i], ".csv", sep="")
    write.csv(current_df, filename)
  }
}

saveConditionsAsFiles(output, conditions)

sanity_check = function(output) {
  check = output[,letters[1:24]]
  master = c()
  for (i in letters[1:24]) {
    for (j in letters[1:24]) {
      print(sum(unique(output[,i]) %in% unique(output[,j])))
    }
    master = c(master, output[,i])
    print(length(unique(master)))
  }
}

output[duplicated(output$Object),c("Object")]

sanity_check(output)