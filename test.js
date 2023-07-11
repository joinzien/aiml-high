// SPDX-License-Identifier: MIT

"use strict";

const AimlHigh = require("./aiml-high");

const testTimeout = 1000;
const variableName = "Variable";
const variableValue = "Value";

const botAttributes = { name: "WireInterpreter", age: "42" };

const interpret = new AimlHigh(botAttributes, {});
interpret.loadFiles(["./test.aiml.xml"]);

setTimeout(function () {
  // Loading and saving variables
  const beforeState = JSON.parse(JSON.stringify(interpret.saveState()));

  interpret.updateState(variableName, variableValue);

  const afterState = JSON.parse(JSON.stringify(interpret.saveState()));

  const actualVariableValue = interpret.getState(variableName);

  interpret.removeState(variableName);

  const cleanedState = JSON.parse(JSON.stringify(interpret.saveState()));

  const emptyState = {};
  const populatedState = { Variable: "Value" };

  if (JSON.stringify(beforeState) === JSON.stringify(emptyState)) {
    console.log("PASS:  saveState");
  } else {
    console.log("FAIL  saveState");
  }

  if (actualVariableValue === variableValue) {
    console.log("PASS:  getState");
  } else {
    console.log("FAIL  getState");
  }

  if (JSON.stringify(afterState) === JSON.stringify(populatedState)) {
    console.log("PASS:  updateState");
  } else {
    console.log("FAIL  updateState");
  }

  if (JSON.stringify(cleanedState) === JSON.stringify(emptyState)) {
    console.log("PASS:  removeState");
  } else {
    console.log("FAIL  removeState");
  }
}, testTimeout);

const callback = function (answer, wildCardArray, input) {
  const possibleValues = this;

  // Loop through possible values, return if correct
  for (const n in possibleValues) {
    if (answer === possibleValues[n]) {
      console.log("PASS: ", input, " - Returned: ", answer);
      return true;
    }
  }

  // Was incorrect. Not good.
  console.error("FAIL: ", input, "\n", "    - Returned: ", answer);
  return false;
};

setTimeout(function () {
  // Test bot attributes
  interpret.findAnswer(
    "What is your name?",
    callback.bind(["My name is " + botAttributes.name + "."]),
  );

  // Test setting and getting variable values
  interpret.findAnswer("My name is Ben.", callback.bind(["Hey Ben.!"]));
  interpret.findAnswer(
    "What is my name?",
    callback.bind(["Your name is Ben."]),
  );

  // Test srai tag
  interpret.findAnswer(
    "Who are you?",
    callback.bind(["My name is " + botAttributes.name + "."]),
  );

  // Test random tag
  interpret.findAnswer("Give me a letter.", callback.bind(["A", "B", "C"]));
  interpret.findAnswer(
    "Test srai in random.",
    callback.bind([
      "My name is " + botAttributes.name + ".",
      "Your name is Ben.",
    ]),
  );
  interpret.findAnswer(
    "Test wildcard What is my name?",
    callback.bind(["Thanks for testing!"]),
  );

  // Test sr tag
  interpret.findAnswer("Test sr tag", callback.bind(["Your name is Ben."]));
  interpret.findAnswer(
    "Test sr in random",
    callback.bind([
      "My name is " + botAttributes.name + ".",
      "Your name is Ben.",
    ]),
  );

  // Test star tag
  interpret.findAnswer("Test the star tag", callback.bind(["What is my name"]));

  // Test that tag
  interpret.findAnswer(
    "Test the that tag",
    callback.bind(["I start testing that."]),
  );
  interpret.findAnswer(
    "Test that-tag. match",
    callback.bind(["That matched quite well!"]),
  );
  interpret.findAnswer("Test that-tag. dont match", callback.bind([undefined]));

  // Test condition tag
  interpret.findAnswer(
    "What is your feeling today?",
    callback.bind(["I don't feel anything"]),
  );
  interpret.findAnswer(
    "How are you feeling today?",
    callback.bind([undefined]),
  );
  interpret.findAnswer(
    "Tell me about your feelings",
    callback.bind([
      "I kinda feel nothing My name is " + botAttributes.name + ".",
    ]),
  );
  interpret.findAnswer("You feel crumpy", callback.bind(["I feel crumpy!"]));
  interpret.findAnswer(
    "What is your feeling today?",
    callback.bind(["I don't feel anything"]),
  );
  interpret.findAnswer("You feel happy", callback.bind(["I feel happy!"]));
  interpret.findAnswer(
    "How are you feeling today?",
    callback.bind(["I am happy!"]),
  );
  interpret.findAnswer(
    "What is your feeling today?",
    callback.bind(["Feeling happy!"]),
  );
  interpret.findAnswer(
    "Tell me about your feelings",
    callback.bind(["I am happy!"]),
  );
  interpret.findAnswer("You feel sad", callback.bind(["I feel sad!"]));
  interpret.findAnswer(
    "How are you feeling today?",
    callback.bind(["I am sad!"]),
  );
  interpret.findAnswer(
    "What is your feeling today?",
    callback.bind(["Feeling sad today"]),
  );
  interpret.findAnswer(
    "Tell me about your feelings",
    callback.bind(["I am sad!"]),
  );

  // Test wildcards
  interpret.findAnswer(
    "Explain HANA",
    callback.bind(["Sorry, I do not have a clue"]),
  );

  // Test Think tag
  interpret.findAnswer(
    "I am 123",
    callback.bind(["Text before random Text after random"]),
  );
  interpret.findAnswer(
    "How old am I?",
    callback.bind(["You are 22", "You are 123"]),
  );
  interpret.findAnswer(
    "What do you know about me?",
    callback.bind([
      "Your name is Ben. and you are 22",
      "Your name is Ben. and you are 123",
    ]),
  );

  // Test condition and srai
  interpret.findAnswer(
    "Test condition and srai",
    callback.bind(["Feeling sad today Your name is Ben."]),
  );
  interpret.findAnswer("You feel happy", callback.bind(["I feel happy!"]));
  interpret.findAnswer(
    "Test condition and srai",
    callback.bind(["Feeling happy! My name is " + botAttributes.name + "."]),
  );
  interpret.findAnswer("You feel crumpy", callback.bind(["I feel crumpy!"]));
  interpret.findAnswer(
    "Test condition and srai",
    callback.bind([
      "I don't feel anything You are 22",
      "I don't feel anything You are 123",
    ]),
  );

  // Test finding nothing
  interpret.findAnswer(
    "Test the wildcard pattern!",
    callback.bind(["I found nothing."]),
  );

  // Case formatting
  interpret.findAnswer(
    "Do uppercase Greg Leuch",
    callback.bind(["Hello GREG LEUCH"]),
  );
  interpret.findAnswer(
    "Do lowercase Greg Leuch",
    callback.bind(["Hello greg leuch"]),
  );
  interpret.findAnswer(
    "Do formal case greg leuch",
    callback.bind(["Hello Greg Leuch"]),
  );
  interpret.findAnswer(
    "Do sentence greg the botmaster",
    callback.bind(["Greg the botmaster is the best."]),
  );

  // Allow non-formal tags
  interpret.findAnswer(
    "I like GIFs",
    callback.bind(['GIF this: <img src="GIF"/>']),
  );

  // Allow non-formal tags
  interpret.findAnswer("Support BR tags", callback.bind(["This\nis\na\nbot."]));

  // Case insensitive testing
  interpret.findAnswer("You feel BAD", callback.bind(["I feel BAD!"]));
  interpret.findAnswer("You feel good", callback.bind(["I feel good!"]));
  interpret.findAnswer("You feel g332-sdfds__#ood", callback.bind([undefined]));
  interpret.findAnswer(
    "My name is nwbjks,-_??@$#mdnmdf",
    callback.bind([undefined]),
  );
  interpret.findAnswer(
    "My name is nwbjks-mdnmdf",
    callback.bind(["Hey nwbjks-mdnmdf!"]),
  );
  // interpret.findAnswer('You feel hAPPy', callback.bind('I feel HAPPy!')); // INTENTIONAL ERROR CHECKING
  // interpret.findAnswer('You feel FINEeeeee', callback.bind('I feel FINEEEEEE!')); // INTENTIONAL ERROR CHECKING
}, testTimeout);
