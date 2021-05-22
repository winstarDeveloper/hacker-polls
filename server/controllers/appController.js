const fs = require("fs");
const catchAsync = require("./../utils/catchAsync");

exports.getHackersData = catchAsync(async (req, res, next) => {
  // console.log("Path: ", `${__dirname}/data.json`);
  fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
    const hackers_data = JSON.parse(data);
    // console.log("Data: ", hackers_data);
    res.status(200).json({
      status: "success",
      results: hackers_data.length,
      data: hackers_data,
    });
  });
});

exports.addHacker = catchAsync(async (req, res, next) => {
  fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
    const hackers_data = JSON.parse(data);
    req.body.id =  Math.floor((1 + Math.random()) * 0x10000);
    req.body.votes = 0;
    hackers_data.push(req.body);
    // console.log("Data: ", hackers_data);

    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(hackers_data),
      "utf-8",
      (err) => {
        res.status(200).json({
          status: "success",
          message: "New Hacker Added Successfully",
          results: hackers_data.length,
          data: hackers_data,
        });
      }
    );
  });
});

exports.updateHacker = catchAsync(async (req, res, next) => {
  fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
    let hackers_data = JSON.parse(data);
    const temp_hackers_data = hackers_data.filter((i) => i.id === req.params.id*1);
    req.body['votes'] = temp_hackers_data[0].votes;
    req.body.id = req.params.id*1;
    // console.log(temp_hackers_data)
    hackers_data = hackers_data.filter((i) => i.id !== req.params.id * 1);
    hackers_data.push(req.body);
    hackers_data.sort((a, b) => {
      let comparison = 0;
      if (a.id > b.id) comparison = 1;
      else comparison = -1;
      return comparison;
    });

    // console.log("Data: ", hackers_data);

    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(hackers_data),
      "utf-8",
      (err) => {
        res.status(200).json({
          status: "success",
          message: "Hacker Data Edited Successfully",
          results: hackers_data.length,
          data: hackers_data,
        });
      }
    );
  });
});

exports.deleteHacker = catchAsync(async (req, res, next) => {
  fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
    let hackers_data = JSON.parse(data);

    hackers_data = hackers_data.filter((i) => i.id !== req.params.id * 1);

    hackers_data.sort((a, b) => {
      let comparison = 0;
      if (a.id > b.id) comparison = 1;
      else comparison = -1;
      return comparison;
    });

    // console.log("Data: ", hackers_data);

    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(hackers_data),
      "utf-8",
      (err) => {
        res.status(200).json({
          status: "success",
          message: "Hacker Data Deleted Successfully",
          results: hackers_data.length,
          data: hackers_data,
        });
      }
    );
  });
});

exports.castVote = catchAsync(async (req, res, next) => {
  fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
    let hackers_data = JSON.parse(data);
    let hacker_name = '';
    hackers_data.map((i) => {
      if(i.id === req.params.id * 1){
        i.votes += 1;
        hacker_name = i.hacker_name;
      } 
    });
  
    // console.log("Data: ", hackers_data);

    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(hackers_data),
      "utf-8",
      (err) => {
        res.status(200).json({
          status: "success",
          message: "Vote Casted to "  + hacker_name + " Successfully",
          results: hackers_data.length,
          data: hackers_data
        });
      }
    );
  });
});
