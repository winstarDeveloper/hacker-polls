import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import ThumbUp from "@material-ui/icons/ThumbUp";

import * as URL from "./../utils/api_urls";

const listHackers = (hackers) => {
  const voteHacker = async (id) => {
    if (window.localStorage.getItem("voted")) {
      alert("Your Vote has already been casted !");
    } else {
      try {
        const vote_url = URL.VotehackerURL + id;
        const response = await fetch(vote_url);
        const data = await response.json();

        if (data.status !== "success") {
          alert(data.message);
        } else {
          alert(data.message);
        }
        window.localStorage.setItem("voted", true);
        window.location.reload(false);
      } catch (err) {
        alert("Some Error occured, Please try again");
        window.localStorage.setItem("voted", false);
      }
    }
  };
  return hackers.map((i) => {
    return (
      <div className="content__box" key={i.id}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p className="content__box-heading">{i.hacker_name}</p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="content__box-details">
              <ul className="content__box-details-list">
                <li>
                  <p>No. of Challenges Solved: {i.challenges_solved}</p>
                </li>
                <li>
                  <p>Expertise Level: {i.expertise}</p>
                </li>
                <li>
                  <p>Expert in: </p>
                </li>
              </ul>

              <table className="table table-striped table-bordered content__box-table">
                <thead>
                  <tr className="table-active">
                    <th scope="col">Skill</th>
                    <th scope="col">Rating (1-5)</th>
                  </tr>
                </thead>
                <tbody>
                  {i.fields.map((j, index) => {
                    return (
                      <tr key={index}>
                        <td>{j.field}</td>
                        <td>{j.level}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="content__box-vote text-center">
                {window.localStorage.getItem("voted") ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ThumbUp />}
                      disabled
                    >
                      Vote
                    </Button>
                    <p className="text-muted">Your Vote is already Casted</p>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ThumbUp />}
                    onClick={() => {
                      voteHacker(i.id);
                    }}
                  >
                    Vote
                  </Button>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  });
};

const Main = (props) => {
  return <div className="content">{listHackers(props.hackers)}</div>;
};

export default Main;
