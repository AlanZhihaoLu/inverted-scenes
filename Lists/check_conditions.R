setwd("~/Documents/Graduate Files/InvertedScenes/invertedScenes-main/Lists")
main_list = read.csv("rb01_list.csv")

full_check = function(condition_letter, main_list) {
  full_report = c()
  full_report = c(full_report, consistent_scene_probe_check(condition_letter, main_list))
  full_report = c(full_report, number_per_condition_check(condition_letter))
  for (message in full_report) {
    cat(paste(message, "\n"))
  } 
}

number_per_condition_check = function(condition_letter) {
  filename=paste("rb01_condition", condition_letter, ".csv", sep="")
  check=read.csv(filename)
  report = c()
  if (all(table(check$Object)==2)) {
    report = c(report, paste(filename, "Object Status --> GOOD"))
  } else {
    report = c(report, paste(filename, "Object Status --> ERROR"))
  }
  if (all(table(check$consistency_category) == c(30, 60, 30))) {
    report = c(report, paste(filename, "consistency_category Status --> GOOD"))
  } else {
    report = c(report, paste(filename, "consistency_category Status --> ERROR"))
  }
  if (all(c(all(table(check$Object)==2), all(table(check$consistency_category) == c(30, 60, 30))))) {
    report = c(report, paste(filename, "number_per_condition_check passes with no errors --> GOOD"))
  } else {
    report = c(report, paste(filename, "ERROR in condition_check --> ERROR"))
  }
  return(report)
}

consistent_scene_probe_check = function(condition_letter, main_list) {
  filename=paste("rb01_condition", condition_letter, ".csv", sep="")
  check=read.csv(filename)
  con_sub = check[check$Consistent=="Consistent",]
  cat("---------------------------------------------------\n")
  if (nrow(con_sub) == 60) {
    cat(paste(filename, "Total number of unique objects is 60 --> GOOD\n"))
    unique_objects_flag = TRUE
  } else {
    cat(paste(filename, "Total number of unique objects is NOT 60:", nrow(con_sub), "unique objects --> ERROR\n"))
    unique_objects_flag = FALSE
  }
  object_list = main_list[main_list$Object %in% con_sub$Object,]
  counter = 0
  for (i in 1:nrow(con_sub)) {
    if (!(object_list[which(object_list$SceneImage == con_sub$SceneImage[i]),c("Object")] == con_sub[i,c("Object")])) {
      cat("There is an incorrect scene-probe pairing at:\n")
      print(con_sub[i,])
      counter = counter + 1
    }
  }
  report = c(paste(filename, "Total incorrect scene-probe pairings:", counter, ifelse(counter==0, "--> GOOD", "ERROR")))
  if (counter == 0&unique_objects_flag) {
    report = c(report, paste(filename, "consistent_object_probe_check passes with no errors --> GOOD"))
  } else {
    report = c(report, paste(filename, "ERROR in condition_check --> ERROR"))
  }
  return(report)
}

for (letter in LETTERS[1:1]) {
  full_check(letter, main_list)
}
