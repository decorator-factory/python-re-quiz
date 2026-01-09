# python-re-quiz

URL: https://decorator-factory.github.io/python-re-quiz/

This is a quiz that demonstrates some complexity, surprising behaviour and common mistakes with Python's standard library `re` module.
Number 3 will blow your mind!

It is very low tech. For each item, click on "Reveal answer" and decide for yourself whether you had it right.

I used to smirk at the "Now you have two problems" meme and people generally ridiculing regular expressions.
Surely _I_ am good at regex! They just don't understand it.
However, after some reflection and constructing the first 10 or so quiz items I am officially retracting my smirk.
With great terseness comes great responsibility.
Besides the essential problems of expressing a state machine
in a terse and declarative way, common regex syntaxes suffer from various
accidental complexities (as do all computer languages), and regex engines have annoying differences.
Regular expressions require an unusual amount of diligence per line of code. I still write
`?!<` instead of `?<!` all the time. Had to double check just for that sentence.


## TODO

- Add "copy code" button to code blocks (accessibility feature)

    - Should we avoid copying `>>>` in REPL sessions?

- Add some testing of examples (maybe with pyodide)?

- Syntax highlighting

- Extract the quiz items as data (maybe just move to a separate JS file?)

- Make back/forward less janky

- Can we get rid of all the JavaScript?
