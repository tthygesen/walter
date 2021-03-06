import React, { Component } from "react";
import { setAuthHeader } from "../../utils/functions";
import { Context } from "../Provider";
import axios from "axios";
import _ from "lodash";

//style
import "../../scss/pages/Profile.scss";

//Componets
import Card from "./profile/Card";
import Experience from "./profile/Experience";
import Education from "./profile/Education";
import Skill from "./profile/Skill";
import Bio from "./profile/Bio";
import AddBtn from "./profile/Add";

export default class Profile extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      photo: "",
      name: "",
      lastname: "",
      status: "",
      bio: "",
      socials: {},
      contact: {},
      living: {},
      skills: [],
      experience: [],
      educations: []
    };
    this.getUserProfile = this.getUserProfile.bind(this);
  }
  getUserProfile = async () => {
    const res = await axios.get("/api/profile").catch(err => {
      console.log(err);
    });
    if (res) {
      console.log(res.data);
      const profile = res.data;
      profile.socials = _.isEmpty(profile.socials) ? {} : profile.socials;
      profile.living = _.isEmpty(profile.living) ? {} : profile.living;
      profile.contact = _.isEmpty(profile.contact) ? {} : profile.contact;

      this.setState({
        name: profile.name,
        photo: profile.photo,
        lastname: profile.lastname,
        status: profile.status,
        bio: profile.bio,
        contact: profile.contact,
        socials: profile.socials,
        living: profile.living,
        skills: profile.skills,
        experience: profile.workexperience,
        educations: profile.educations
      });
      this.context.setProfile(this.state);
    }
  };
  async componentDidMount() {
    const token = localStorage.getItem("jwt");
    await setAuthHeader(token);
    this.getUserProfile();
  }
  render() {
    return (
      <React.Fragment>
        <section className="main-profile">
          <Card
            photo={this.state.photo}
            name={this.state.name}
            lastname={this.state.lastname}
            status={this.state.status}
            contact={this.state.contact}
            living={this.state.living}
            socials={this.state.socials}
          />
          <article className="info">
            <Bio text={this.state.bio} />
            <ul>
              <div className="categori-header">
                <h4>Experience</h4>
                <AddBtn link="experience" />
              </div>
              {this.state.experience.map((exp, i) => (
                <Experience data={exp} key={i} />
              ))}
            </ul>
            <ul>
              <div className="categori-header">
                <h4>Education</h4>
                <AddBtn link="education" />
              </div>
              {this.state.educations.map((edu, i) => (
                <Education data={edu} key={i} />
              ))}
            </ul>
            <ul>
              <div className="categori-header">
                <h4>Skills</h4>
                <AddBtn link="skill" />
              </div>
              {this.state.skills.map((skill, i) => (
                <Skill data={skill} key={i} />
              ))}
            </ul>
          </article>
        </section>
      </React.Fragment>
    );
  }
}
