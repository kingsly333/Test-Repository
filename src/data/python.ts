// Python basics track (~50 hrs, 15 weeks). No exam: the source is the official Python tutorial
// (docs.python.org/3/tutorial). Links checked (HTTP 200, anchors present) on 2026-10-06.
// Goal given by the user: "understand the basics". Weeks W21-W35 in plan.ts.

import type { Resource } from "./modules";

const T = "https://docs.python.org/3/tutorial";
const L = "https://docs.python.org/3/library";

export interface PyWeek {
  n: number;
  goal: string;
  read: Resource[];
  practice: string;
}

export const PY_WEEKS: PyWeek[] = [
  { n: 21, goal: "Run Python and use numbers, strings and lists as a calculator.",
    read: [{ label: "Using the Python interpreter", url: `${T}/interpreter.html` }, { label: "An informal introduction to Python", url: `${T}/introduction.html` }],
    practice: "Install Python, open the REPL, and try every example from the introduction page yourself." },
  { n: 22, goal: "Make decisions and repeat work with if, for and range.",
    read: [{ label: "if statements", url: `${T}/controlflow.html#if-statements` }, { label: "for statements", url: `${T}/controlflow.html#for-statements` }, { label: "range()", url: `${T}/controlflow.html#the-range-function` }],
    practice: "Write a script that prints a 12x12 times table and a FizzBuzz." },
  { n: 23, goal: "Define and call functions, including default and keyword arguments.",
    read: [{ label: "Defining functions", url: `${T}/controlflow.html#defining-functions` }, { label: "More on defining functions", url: `${T}/controlflow.html#more-on-defining-functions` }],
    practice: "Turn last week's scripts into functions with docstrings." },
  { n: 24, goal: "Choose between lists, tuples, sets and dictionaries.",
    read: [{ label: "Data structures", url: `${T}/datastructures.html` }],
    practice: "Count word frequencies in a paragraph using a dict, then sort the result." },
  { n: 25, goal: "Write comprehensions and loop cleanly over collections.",
    read: [{ label: "List comprehensions", url: `${T}/datastructures.html#list-comprehensions` }, { label: "Looping techniques", url: `${T}/datastructures.html#looping-techniques` }],
    practice: "Rewrite five of your earlier loops as comprehensions or enumerate/zip loops." },
  { n: 26, goal: "Split code into modules and import from the standard library.",
    read: [{ label: "Modules", url: `${T}/modules.html` }],
    practice: "Move your functions into a utils.py and import them from a main script." },
  { n: 27, goal: "Read and write text files and JSON.",
    read: [{ label: "Input and output", url: `${T}/inputoutput.html` }, { label: "json module", url: `${L}/json.html` }, { label: "pathlib module", url: `${L}/pathlib.html` }],
    practice: "Save and reload a to-do list as JSON." },
  { n: 28, goal: "Handle errors with try/except and raise your own.",
    read: [{ label: "Errors and exceptions", url: `${T}/errors.html` }],
    practice: "Make your file code survive missing files and bad input." },
  { n: 29, goal: "Model things with classes and objects.",
    read: [{ label: "Classes", url: `${T}/classes.html` }],
    practice: "Build a small class (e.g. a Study Session or Account) with methods." },
  { n: 30, goal: "Know what the standard library already gives you.",
    read: [{ label: "Brief tour of the standard library", url: `${T}/stdlib.html` }, { label: "Brief tour, part II", url: `${T}/stdlib2.html` }],
    practice: "Use datetime, collections and random in one small script." },
  { n: 31, goal: "Set up isolated projects with venv and pip.",
    read: [{ label: "Virtual environments and packages", url: `${T}/venv.html` }],
    practice: "Create a venv, install a package, and write a requirements.txt." },
  { n: 32, goal: "Mini project 1: read a CSV and print a summary.",
    read: [{ label: "csv module", url: `${L}/csv.html` }],
    practice: "Pick one of your own CSV exports and report totals per category." },
  { n: 33, goal: "Mini project 1: add functions, error handling and file output.",
    read: [{ label: "Errors and exceptions (revisit)", url: `${T}/errors.html` }],
    practice: "Refactor the script, handle bad rows, and write the summary to a new file." },
  { n: 34, goal: "Mini project 2: a small class-based tool with tests.",
    read: [{ label: "unittest module", url: `${L}/unittest.html` }],
    practice: "Write 5 unit tests for your tool and make them pass." },
  { n: 35, goal: "Review and checkpoint: can you explain each topic without notes?",
    read: [{ label: "Python tutorial index", url: `${T}/index.html` }],
    practice: "Re-do one exercise from each of weeks 21-34 without looking." },
];

export const PY_BY_WEEK = Object.fromEntries(PY_WEEKS.map((w) => [w.n, w]));
