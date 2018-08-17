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


@app.route("/metadata/<year>")
def marriage_rates_by_year(year):
    # sel = [
    #     marriage_rate_metadata
    # ]

    results = db.session.query({}).all()
    print(results)


if __name__ == "__main__":
    app.run()