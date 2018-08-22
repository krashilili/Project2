import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/marriage_rates.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
marriage_rate_metadata = Base.classes.marriage_rates
# Samples = Base.classes.samples

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/metadata/year/<year>")
def marriage_rates_by_year(year):
    sel = [
        marriage_rate_metadata.State,
        getattr(marriage_rate_metadata, 'Y_'+year)
    ]

    results = db.session.query(*sel).all()

    # Format the data to send as json
    data = {
        "states": [result[0] for result in results],
        "marriage_rates": [result[1] for result in results]
    }

    return jsonify(data)

@app.route("/metadata/state/<state>")
def marriage_rates_by_state(state):

    stmt = db.session.query(marriage_rate_metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    sample_data = df.loc[df['State'] == state, :]
    years = [ year.split('_')[-1] for year in sample_data.columns.values[2:]]
    marriage_rates = sample_data.values[0][2:]
    data = {
        'year': years,
        'marriage_rates': marriage_rates.tolist()
    }

    return jsonify(data)

@app.route("/states")
def states():
    sel = [marriage_rate_metadata.State]

    states = [state[0] for state in db.session.query(*sel).all()]

    return jsonify(states)

if __name__ == "__main__":
    app.run()