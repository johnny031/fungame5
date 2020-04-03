from flask import Flask, render_template, request
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/main")
def hello():
    n = request.args.getlist("n")
    r = request.args.getlist("r")
    return render_template("main.html",n=n,r=r)