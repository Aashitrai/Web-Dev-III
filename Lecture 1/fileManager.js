const fs = require("fs");

const fileName = "test.txt";

console.log("Creating File...");

fs.writeFile(fileName, "Hello Node.js", function (err) {
  if (err) {
    console.log("Error creating file");
    return;
  }
  console.log("File Created");

  console.log("Reading File");
  fs.readFile(fileName, "utf8", function (err, data) {
    if (err) {
      console.log("Error reading file");
      return;
    }
    console.log(data);

    fs.appendFile(fileName, "\nLearning FS Module", function (err) {
      if (err) {
        console.log("Error updating file");
        return;
      }
      console.log("File Updated");

      fs.readFile(fileName, "utf8", function (err, data) {
        console.log(data);

        fs.unlink(fileName, function (err) {
          if (err) {
            console.log("Error deleting file");
            return;
          }
          console.log("File Deleted");
        });
      });
    });
  });
});