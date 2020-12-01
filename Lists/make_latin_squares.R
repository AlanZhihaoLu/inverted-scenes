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
main_list = main_list[!main_list$SceneImage == "basketball_net.jpg",]

# Helper functions
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

scramble = function(df) {
  return(df[sample(1:nrow(df)),])
}

# Main functions
## Function hierarchy: make_latin_squares > make_all_conditions > make_condition > assign_objects

make_latin_squares = function(main_list, conditions) {
  con_df = make_con_df(conditions)
  main_list = cbind(main_list, con_df)
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
  again = TRUE
  main_list = scramble(main_list)
  con_names = names(con_df)
  for (con_name in con_names) {
    con_vec = con_df[,c(con_name)]
    con_vec = make_condition(main_list, con_vec)
    main_list[,c(con_name)] = con_vec
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
    probe_df = df1[df1$Consistent == "Consistent", c("Object", "Basic", "Superordinate", "Supersuperordinate")]
    
    df1 = assign_objects(df1, probe_df)
    diff_crit = abs(table(df1$consistency_category)[1] - table(df1$consistency_category)[3])
    if (all(apply(df1, 2, function(x) any(is.na(x)))==FALSE)&diff_crit<3) {
      go = FALSE
      print(table(df1$consistency_category))
      return(df1$Object)
    } else {
      counter = counter + 1 
      if (counter > 20) {
        break
      }
    }
  }
  stop("Reached iteration limit (20); Trying again.")
}

assign_objects = function(df1, probe_df) {
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
  return(df1)
}

# Executing function and storing latin square data
final_output = make_latin_squares(main_list, conditions)
# write.csv(final_output, "rb01_conditions.csv")


