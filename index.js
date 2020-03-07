const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

const jornalLog = require('./model/JORNAL_LOG')
const registeredFile = require('./model/REGISTERED_FILE')
const filepath = "./file/"

app = express();


// getting files inside the given folder
const listFilesInsideFTP = (folder) => {
	return fs.readdirSync(folder, (err, files) => {
		return files;
	});
};

// read the file and filtering files after Jan 1st 2019 and then sending to database
const readFile = (fileName) => {
	// concatinating file with full path
	fileName = filepath + fileName
	// reading for given file
	return fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) {
			//if file doesn't exist
			console.log("File doesn't exist")
		} else {
			// spliting the file with newline and making array of lines( 1 line as item of array)
			lineArray = data.split("\n");

			// sepating columns from each line
			for (line in lineArray) {
				//split by space inside each line
				eachString = lineArray[line].split(" ");
				//checking for rebooting
				if (eachString[0] == "--") {
					// console.log("Rebooting")
				} else {
					let time = eachString[0] + " " + eachString[1] + " " + eachString[2];
					let title = eachString[4];
					let detail = ''
					for (s in eachString) {
						if (s > 4) {
							detail = detail + ' ' + eachString[s]
						}
					}
					// creating log object
					log = {
						log_time: time,
						log_title: title,
						log_detail: detail
					}
					// console.log("Each line: ",log);
					jornalLog.insert(log, "jornal_logs", function (err, results) {
						if (err) {
							// error will be displayed hed
							console.log(err)
						}
						else {
							// if result return	
							console.log(results)
						}
					});

				}

			}
			console.log("Length:", lineArray.length);

		}
	})
}


const initialize = async () => {
	const folder = filepath
	const files = listFilesInsideFTP(folder);
	let listAfter2019 = [];
	var newFile = [];
	var oldFile = [];
	fileName = files[0];

	// checking for new file and in database and adding to newFile Array

	registeredFile.get('registered_log_files', (err, results) => {
		if (err) {
			console.log(err)
		} else {
			// reading old file from database
			results.forEach((file) => {
				oldFile.push(file.file_name);
			})
			console.log("Old file:", oldFile)
			// filtering new files if file is not found in oldFile add to newFile array
			files.forEach((file) => {
				if (oldFile.indexOf(file) == -1) {
					newFile.push(file);
				}
			});
			console.log("new file: ", newFile)
			// filtering after 2019 files from new files 
			newFile.forEach(file => {
				fileName = file.split("_");
				year = Number.parseInt(fileName[2])
				// checking for year and adding to valid list
				if (year > 2019) {
					// adding to arrary of listAfter2019 	
					listAfter2019.push(file);

				}
			})
			console.log("List ater 2019", listAfter2019);
			// registerign new files to datase
			newFile.forEach((file) => {
				fileName = file.split("_");
				newfile = {
					file_name: file,
					generated_time: fileName[2]+" "+fileName[3]+" "+fileName[4].split(".")[0],
				}
				registeredFile.insert(newfile, 'registered_log_files', (err, results) => {
					if (err) {
						console.log(err)
					} else {
						// console.log("file registerd successfully")
					}
				})
			});

			listAfter2019.forEach((file) => {
				readFile(file);
			});
		}
	});
}

// cron.schedule("0 0 * * *", function(){   // daily schedule
cron.schedule("* * * * *", function () { 		// schedule every minute
	initialize();
});

app.listen(3128);
