import React from 'react';

function Homepage() {
  return (
    <div>
      <div className="hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '5rem 0' }}>
        <div className="container text-center">
          <h1 className="display-4">Welcome to Student Assess</h1>
          <p className="lead">An interactive platform for student presentations and evaluations</p>
        </div>
      </div>

      <section className="features py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Key Features</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">Presentation Upload</h3>
              <p>Seamlessly upload presentation materials, including slides, audio, or video recordings.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">Evaluation Criteria</h3>
              <p>Define and incorporate a comprehensive set of evaluation criteria for assessing student presentations.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">Scoring and Feedback</h3>
              <p>Assign scores, provide feedback, and comments to presenters.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">Personalized Feedback Reports</h3>
              <p>Generate comprehensive feedback reports for each student, summarizing scores, comments, and areas for improvement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">About StudentAss</h3>
              <p>
                StudentAss is a cutting-edge platform designed to enhance the experience of student presentations and evaluations. With StudentAss,
                you can easily upload and share your presentation materials, receive valuable feedback from peers and professors, and track your
                progress over time.
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <h3 className="text-primary">Why Choose StudentAss?</h3>
              <ul>
                <li>Streamlined Presentation Upload: Upload your presentation materials with ease, including slides, audio, and video recordings.</li>
                <li>
                  Comprehensive Evaluation Criteria: Receive feedback based on a well-defined set of evaluation criteria tailored to your
                  presentation.
                </li>
                <li>
                  Interactive Scoring and Feedback: Get detailed scores, comments, and constructive feedback from evaluators to improve your
                  presentation skills.
                </li>
                <li>Personalized Feedback Reports: Access comprehensive feedback reports that highlight your strengths and areas for improvement.</li>
                <li>
                  Easy Collaboration: Engage in peer-to-peer evaluations and post-presentation discussions to enhance learning and exchange insights.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '5rem 0' }}>
        <div className="container text-center">
          <h2>Ready to Get Started?</h2>
          <p>Only professors can register while students can log in.</p>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
