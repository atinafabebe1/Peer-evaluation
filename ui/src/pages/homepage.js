import React from 'react';
import { Fade, Slide } from 'react-reveal';
import 'bootstrap/dist/css/bootstrap.min.css';

function Homepage() {
  return (
    <div>
      <header className="hero" style={{ background: '#002244', color: 'white', padding: '5rem 0' }}>
        <div className="container text-center">
          <Fade duration={1000}>
            <h1 className="display-3">Welcome to Student Assess</h1>
          </Fade>
          <Fade delay={500} duration={1000}>
            <p className="lead">An interactive platform for student presentations and evaluations</p>
          </Fade>
          <div className="d-flex justify-content-center mt-4">
            <a href="/login" className="btn btn-outline-light btn-lg">
              Login
            </a>
          </div>
        </div>
      </header>

      <section className="features py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Key Features</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">Presentation Upload</h3>
              </Slide>
              <Fade delay={300}>
                <p>Seamlessly upload presentation materials, including slides, audio, or video recordings.</p>
              </Fade>
            </div>
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">Evaluation Criteria</h3>
              </Slide>
              <Fade delay={300}>
                <p>Define and incorporate a comprehensive set of evaluation criteria for assessing student presentations.</p>
              </Fade>
            </div>
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">Scoring and Feedback</h3>
              </Slide>
              <Fade delay={300}>
                <p>Assign scores, provide feedback, and comments to presenters.</p>
              </Fade>
            </div>
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">Personalized Feedback Reports</h3>
              </Slide>
              <Fade delay={300}>
                <p>Generate comprehensive feedback reports for each student, summarizing scores, comments, and areas for improvement.</p>
              </Fade>
            </div>
          </div>
        </div>
      </section>

      <section className="content bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">About Student Assess</h3>
              </Slide>
              <Fade delay={300}>
                <p>
                  Student Assess is a cutting-edge platform designed to enhance the experience of student presentations and evaluations. With Student
                  Assess, you can easily upload and share your presentation materials, receive valuable feedback from peers and professors, and track
                  your progress over time.
                </p>
              </Fade>
            </div>
            <div className="col-md-6 mb-4">
              <Slide left>
                <h3 className="text-primary">Why Choose Student Assess?</h3>
              </Slide>
              <Fade delay={300}>
                <ul>
                  <li>
                    <span className="icon">&#x1F4E6;</span> Streamlined Presentation Upload: Upload your presentation materials with ease, including
                    slides, audio, and video recordings.
                  </li>
                  <li>
                    <span className="icon">&#x2714;</span> Comprehensive Evaluation Criteria: Receive feedback based on a well-defined set of
                    evaluation criteria tailored to your presentation.
                  </li>
                  <li>
                    <span className="icon">&#x270D;</span> Interactive Scoring and Feedback: Get detailed scores, comments, and constructive feedback
                    from evaluators to improve your presentation skills.
                  </li>
                  <li>
                    <span className="icon">&#x1F4C3;</span> Personalized Feedback Reports: Access comprehensive feedback reports that highlight your
                    strengths and areas for improvement.
                  </li>
                  <li>
                    <span className="icon">&#x1F91D;</span> Easy Collaboration: Engage in peer-to-peer evaluations and post-presentation discussions
                    to enhance learning and exchange insights.
                  </li>
                </ul>
              </Fade>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" style={{ background: '#002244', color: 'white', padding: '5rem 0' }}>
        <div className="container text-center">
          <Fade delay={300}>
            <h2 className="animate__animated animate__fadeIn">Ready to Get Started?</h2>
          </Fade>
          <Fade delay={600}>
            <p className="animate__animated animate__fadeInUp">Only professors can register, while students can log in.</p>
          </Fade>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
