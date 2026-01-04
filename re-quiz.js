"use strict";

/** %monospace%, %%%monospace block%%% */
const quizItems = [
  {
    id: "intro",
    title: "Intro",
    body: `
      <p>
      This is a quiz that demonstrates some complexity, surprising
      behaviour and common mistakes with Python's standard library
      %re% module. Sometimes the gotcha in the question isn't
      strictly related to regular expressions, but I decided to
      include those anyway.
      </p>

      <p>
      All the code examples assume that %re% has already been imported.
      </p>

      %%%
      print(re.search("[a-z]+", "banana"))
      %%%

      <p>
      What's the output of this program?
      </p>
    `,
    answers: [
      [false, "%'banana'%"],
      [true, "%<re.Match object; span=(0, 6), match='banana'>%"],
      [false, "%None%"],
      [false, "an exception"],
    ],
    explanation: `
      <p>
      %re.search%, %re.fullmatch%, and %re.match% all produce %re.Match% objects.
      </p>
    `
  },

  {
    id: "match-misnomer",
    title: "Validating an email",
    body: String.raw`
      %%%
      email = "alice@b.com.кц.рф"
      if re.match(r"[a-z]+@[a-z]+\.[a-z]+", email):
          print("valid")
      else:
          print("invalid")
      %%%

      <p>
      What's the output of this program?
      </p>
    `,
    answers: [
      [true, "%valid%"],
      [false, "%invalid%"],
      [false, "an exception"],
    ],
    explanation: `
      <p>
      %re.match% searches for a pattern at the start of a string.
      It does not ensure that the entire string matches the pattern.
      </p>

      %%%
      >>> re.match(r"[a-z]+@[a-z]+\.[a-z]+", "alice@b.com.кц.рф")
      <re.Match object; span=(0, 11), match='alice@b.com'>
      >>>
      %%%

      <p>
      If you need to check if an entire string follows a pattern, use %re.fullmatch% instead.
      Do not use %re.search%/%re.match% in combination with %^% and %$% (<i>foreshadowing</i>).
      </p>
    `
  },

  {
    id: "dollar-is-evil",
    title: "Anchors in sand",
    body: String.raw`
    <p>
    What's the output of this program?
    </p>

    %%%
    print(re.search("^[a-z]+$", "banana\n"))
    %%%
    `,
    answers: [
      [false, "%None%"],
      [true, "%<re.Match object; span=(0, 6), match='banana'>%"],
      [false, "%<re.Match object; span=(0, 7), match='banana\\n'>%"],
      [false, "an exception"],
    ],
    explanation: String.raw`
      <p>From the <a href="https://docs.python.org/3.14/library/re.html#index-2">documentation</a>:</p>

      <blockquote cite="docs.python.org/3.14/library/re.html#index-2">
      %$%
      <p>
      Matches the end of the string or just before the newline at the
      end of the string, and in %MULTILINE% mode also matches before a newline.
      </blockquote>

      <p>
      Unless the "just before final newline" behaviour is what you want, or you're using multiline mode,
      stay away from %$% and use the %\A% (start of string) and %\Z%/%\z% (end of string) anchors.
      If you do need the "just before final newline" behaviour, leave a comment explaining why.
      </p>

      <p>
      This %^...$% thing is littered all over the code in <em>so many</em> Python projects, and it's
      wrong! Okay, it's slightly wrong. Still, it can lead to bugs when you don't realize that %$% doesn't
      necessarily mean "end of string", for example when you assume that a string has no whitespace or
      has a particular length if it matches a regular expression. If you're using regular expressions
      for validation, this can allow bad values to enter into your system.
      </p>

      <p>
      Most of the time the correct solution is to not use any of these anchors
      and just use the correct function from the %re% module. Instead of doing %re.search("^[a-z]+$")%
      or %re.search("\A[a-z]+\Z")%, just do %re.fullmatch("[a-z]+")%.
      </p>

      <p>
      Note that in JavaScript, %$% does mean just the end of the string. The "%$% means end or just before
      the final new line" thing was inherited from Perl and is also present in PCRE2.
      </p>

      <p>
      Takeaway: read the documentation for what you're using. Don't assume that the same
      sigil has the same meaning in two different regex engines.
      </p>
    `
  },

  {
    id: "forwards-range",
    title: "Forwards",
    body: String.raw`
    <p>
    What's the output of this program?
    </p>

    %%%
    print(re.fullmatch("[0123456789-_!#@]+", "<HTML>"))
    %%%
    `,
    answers: [
      [false, "%None%"],
      [true, "%<re.Match object; span=(0, 6), match='<HTML>'>%"],
      [false, "an exception"],
    ],
    explanation: String.raw`
      <p>
      This sneaky character set includes the %9-_% range.
      It represents all of these characters: %9:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_%.
      </p>
    `
  },

  {
    id: "backwards-range",
    title: "Backwards",
    body: String.raw`
    <p>
    What's the output of this program?
    </p>

    %%%
    print(re.search("[z-a]+", "banana"))
    %%%
    `,
    answers: [
      [false, "%None%"],
      [false, "%<re.Match object; span=(0, 6), match='banana'>%"],
      [true, "an exception"],
    ],
    explanation: String.raw`
      %%%
      PatternError: bad character range z-a at position 1
      %%%

      <p>Finally. An island of sanity in the land of regular expressions.</p>
    `
  },

  {
    id: "r-string-1",
    title: "Rrrr I",
    body: `
      <p>Which of these expressions evaluate to %True%?</p>
    `,
    answers: [
      [true, String.raw`%"banana" == r"banana"%`],
      [true, String.raw`%type(r"banana") is str%`],
      [false, String.raw`%"ba\na\na" == r"ba\na\na"%`],
      [false, String.raw`%"\boom" == r"\boom"%`],
      [true, String.raw`%"\splash" == r"\splash"%`],
    ],
    explanation: String.raw`
      <ul class="flow">
        <li>The %r% prefix doesn't produce a special kind of string, it's still an ordinary %str% object.
          All %r% does is prevent backslash (%\%) from being treated specially.
          <p>
          %r"\\_\n"% represents the same value as %"\\\\_\\n"%.
        </li>

        <li>Python does not emit an error when an unknown escape sequence (like %\s%) is encountered.
          Instead, it treats it as the characters %\% and %s%, and emits a %SyntaxWarning%.
          <p>
          This is different from JavaScript, where %\s% means just %s% (and does not raise any warnings).
        </li>
      </ul>
    `
  },

  {
    id: "r-string-2",
    title: "Rrrr II",
    body: `
      <p>Which of these calls produce a match?</p>
    `,
    answers: [
      [true, String.raw`%re.fullmatch("ba\na\na", "ba\na\na")%`],
      [true, String.raw`%re.fullmatch(r"ba\na\na", "ba\na\na")%`],
      [false, String.raw`%re.fullmatch("ba\na\na", r"ba\na\na")%`],
      [false, String.raw`%re.fullmatch(r"ba\na\na", r"ba\na\na")%`],
      [false, String.raw`%re.fullmatch(r"\ba\na\na", "\ba\na\na")%`],
      [true, String.raw`%re.search(r"\ba\na\na", "\ba\na\na")%`],
      [false, String.raw`%re.search("\ba\na\na", r"\ba\na\na")%`],
      [true, String.raw`%re.fullmatch(r"[\b]a\na\na", "\ba\na\na")%`],
    ],
    explanation: String.raw`
      <p>
      In some cases, a character produced by a Python escape happens to represent itself
      when used in a regular expression. For example, both %"\n"% (%"\x0a"%) and %r"\n"% (%"\x5c\x6e"%)
      are regular expressions that match a newline character, and %"\b"% (%"\x08"%) matches the "bell character".
      </p>
      <p>
      It is unfortunate that these characters are allowed in a regular expression.
      I would avoid that because it complicates debugging.
      </p>

      %%%
      >>> pat = re.compile("\banana")
      >>> pat
      re.compile('\x08anana')
      >>> print(pat.pattern)
      anana
      >>>
      %%%

      <p>
      However, when properly escaped, %\b% means the end or beginning of a word. So %r"\b"%
      (aka %"\\b"%) will not match the string %"\b"%.
      </p>
      <p>
      ...unless it's used within a range, like %[\b]% or %[a\bc]%, in which case it does represent the
      bell character.
      </p>
    `
  },

  {
    id: "digits",
    title: "Digits",
    body: String.raw`
    <p>What number of bytes can this program theoretically report?</p>

    %%%
    line = input()
    if re.fullmatch(r"\d{1, 2}", line):
        print("parsed number:", int(line))
        encoded = line.encode("utf-8")
        print("number of bytes:", len(encoded))
    %%%

    <p>(multiple choice)</p>
    `,
    answers: [
      [false, "0"],
      [false, "1 or 2"],
      [false, "3 or 4"],
      [false, "5, 6, 7, or 8"],
      [false, "any non-negative number"],
    ],
    explanation: `
      <p>This is a trick question. %{1, 2}% (with a <b>space</b>) is not special, it just means
        the characters %{%, %1%, "comma", "space", %2%, %}% literally. %{1;2}% and %{1..2}% are
        also interpreted literally.</p>
      <p>So if the match succeeds, %int(line)% has to raise an exception.</p>
      <p>Even worse, %re.VERBOSE% does not change this behaviour.</p>
    `
  },

  {
    id: "digits-for-real",
    title: "Digits (for real)",
    body: String.raw`
    <p>No more fooling around. What number of bytes can this program theoretically report?</p>

    %%%
    line = input()
    if re.fullmatch(r"\d{1,2}", line):
        encoded = line.encode("utf-8")
        print("number of bytes:", len(encoded))
    %%%

    <p>(multiple choice)</p>
    `,
    answers: [
      [false, "0"],
      [true, "1 or 2"],
      [true, "3 or 4"],
      [true, "5, 6, 7, or 8"],
      [false, "any non-negative number"],
    ],
    explanation: String.raw`
      <p>%\d% is not a synonym for %[0-9]%, it can match any decimal Unicode digit, such as
      %²% or %🯹%. UTF-8 encodes each value using 1 to 4 bytes, so the answer is %{x+y for x in [1,2,3,4] for y in [0,1,2,3,4]}%.</p>

      <p>By the way, a string matching %\d+% does not mean it's valid for %int()%.
      For instance, %int("²")% and %int("9"*4301)% will fail.</p>

      <p>The converse is also not true: %int("-420")% and %int("6_9")% succeed.</p>
    `
  },

  {
    id: "digit-dotrange",
    title: "Digit range",
    body: String.raw`
    <p>You are clearly tired of this unicode nonsense and decided to correct your regular expression
    to only accept ASCII digits. </p>

    %%%
    pattern = re.compile(r"[0..9]+")
    %%%

    <p>Which strings will it %.fullmatch()%? (multiple choice)</p>
    `,
    answers: [
      [true, "0"],
      [true, "9"],
      [true, "900"],
      [false, "1"],
      [false, "1234"],
      [false, "%re.compile% raises exception for invalid range"],
    ],
    explanation: `
      <p>The intended range would be %[0-9]% or %[0123456789]%. %[0..9]%, or %[0.9]%, means "0, dot, or 9".</p>
      <p>%[quick brown fox jumps over the lazy dog]% is also a valid range, meaning the same as %[ a-z]%.</p>
    `
  },

  {
    id: "finditer-lazy",
    title: "%finditer%",
    body: `
      %%%
      if re.finditer(r"[0-9]+", "no numbers here"):
          print("valid")
      else:
          print("invalid")
      %%%

      <p>
      What's the output of this program?
      </p>
    `,
    answers: [
      [true, "%valid%"],
      [false, "%invalid%"],
      [false, "an exception"],
    ],
    explanation: `
      <p>
      %re.finditer% returns an iterator of matches, and iterators are typically truthy.
      </p>

      <p>
      %mypy% can catch this mistake if you enable the %truthy-bool% diagnostic.
      </p>
    `
  },

  {
    id: "findall-first",
    title: "First letter of every name",
    body: `
    <p>You're using this regular expression to find names in a string:</p>
    %%%
    >>> re.findall("[_A-Za-z]+", "AliCe Bob __testing1 Charlie")
    ['AliCe', 'Bob', '__testing', 'Charlie']
    %%%
    <p>However, it's not very robust. You only want to allow only the start of the string
    to contain a capital letter or a sequence of underscores. What does the following program print?</p>

    %%%
    print(re.findall("([A-Z]|_+)[a-z]*", "Alice bob __test"))
    %%%
    `,
    answers: [
      [false, `%[%%<re.Match object; span=(0, 5), match='Alice'>,%% %%<re.Match object; span=(10, 16), match='__test'>%%]%`],
      [false, "%['Alice', '__test']%"],
      [true, "%['A', '__']%"],
      [false, "%[('Alice', 'A'), ('__test', '__')]%"],
      [false, "%[('A',), ('__',)]%"],
    ],
    explanation: `
      <p>
      %findall% has a pretty non-uniform interface:
        <ul class="flow">
          <li>If the regular expression doesn't have any capture groups, it returns a list of strings,
          where each string represents an entire match</li>
          <li>If the regular expression has only one capture group, it returns a list of stirngs,
          where each string is the content of that group</li>
          <li>If the regular expression has more than one capture group, it returns a list of
          tuples with those capture groups. It does not contain the "whole match", also known as
          "group 0". So %each_tuple[0]% is group 1, %each_tuple[1]% is group 2 and so on.</li>
        </ul>
      </p>

      <p>
      I would personally recommend using %finditer% unless you're really just hacking together
      a one-time script or playing in the REPL. It uses a more predictable interface producing
      %re.Match% objects:
      </p>

      %%%
      >>> for match in re.finditer("([A-Z]|_+)[a-z]*",
      ...                          "Alice bob __test"):
      ...     print(match)
      ...
      <re.Match object; span=(0, 5), match='Alice'>
      <re.Match object; span=(10, 16), match='__test'>
      >>> for match in re.finditer("[_A-Za-z]+",
      ...                          "Alice bob __test"):
      ...     print(match)
      ...
      <re.Match object; span=(0, 5), match='Alice'>
      <re.Match object; span=(6, 9), match='bob'>
      <re.Match object; span=(10, 16), match='__test'>
      >>>
      %%%

      <p>
      See also:
        <a href="https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/">
        Falsehoods Programmers Believe About Names</a>. In the real world, names are complicated.
        Human (or animal) names can be in all caps, can be all lowercase, can include dashes
        and other characters that are not in %[-_'a-zA-Z0-9]%.
      </p>
    `,
  },

  {
    id: "greed",
    title: "Greed",
    body: String.raw`
    <p>
    What's the output of this program?
    </p>

    %%%
for m in re.finditer(r"'(.*)'", "the 'foo' is 'bar'"):
    print(m)
    %%%
    `,
    answers: [
      [false, "nothing"],
      [false,
        `
          %%%
          <re.Match object; span=(0, 5), match="'foo'">
          <re.Match object; span=(8, 13), match="'bar'">
          %%%
        `],
      [true,
        `
          %%%
          <re.Match object; span=(4, 18), match="'foo' is 'bar'">
          %%%
        `],
      [false, "an exception"],
    ],
    explanation: String.raw`
      <p>
      %*%, %+%, %{m,}%, %{m,n}% are all <em>greedy</em>: if several outcomes are
      possible, they pick the longest one.
      </p>

      <p>
      If this is undesirable, you can use non-greedy quantifiers (%'(.*?)'%),
      or exclude the separator from the inner part (%'([^']*)'%).
      </p>

      <p>
      Read more about greedy and non-greedy quantifiers in the
        <a href="https://docs.python.org/3.14/library/re.html#index-6">
        %re% documentation
        </a>
      or the <a href="https://www.regular-expressions.info/repeat.html">
        regular-expressions.info site</a>.
      </p>
    `
  },

  {
    id: "typing-match-any",
    title: "Type Checking I",
    body: `
      <p>
      Python now has a variety of static analysis tools called "type checkers"
      that can look at type annotations in your code and report errors (or provide
      a useful suggestion list after you type %.% in your editor).
      </p>
      <p>
      What do %ty%, %mypy% and %pyright% say about this code when using
      their default settings?
      </p>

      %%%
      import re

      def handle_pattern(m: re.Match) -> str:
          return m.string + 1
      %%%
    `,
    answers: [
      [false, "error: you can't add %str% and %int%"],
      [false, "error: you're returning an %int%, but the function is annotated as returning %str%"],
      [false, "error/warning: a generic type is missing a type argument"],
      [true, "everything is fine"],
    ],
    explanation: `
      <p>
      %re.Match% is a generic class: it accepts a <i>type parameter</i>,
      in this case %re.Match[str]% or %re.Match[bytes]%, to specify
      whether it represents a match over a unicode string or a byte string.
      </p>
      <p>
      If you don't specify a type parameter, it is assumed to be %Any%, so
      %m: re.Match% means %m: re.Match[Any]%, and therefore %m.string% also
      has type %Any%. Just like %any% in TypeScript, %Any% in Python is "viral":
      it allows all operations, and the result of every operation is also %Any%.
      </p>
      <p>
      Always specify the parameter to %re.Match% (in most cases it's %re.Match[str]%).
      Both %mypy% and %pyright% will require this in strict mode, and they have
      more granular settings as well.
      </p>
    `
  },

  {
    id: "typing-maybe-none",
    title: "Type Checking II",
    body: `
      <p>
      What happens here? Assume that we're using %mypy% and %pyright% on their
      strictest settings.
      </p>

      %%%
      import re

      def handle_pattern(m: re.Match[str]) -> str:
          return m.group("bar")

      m = re.search(r"i am ((?P<foo>FOO)|(?P<bar>BAR))", "i am FOO")
      assert m is not None
      print(handle_pattern(m))
      %%%
    `,
    answers: [
      [false, "type checking error & %None% is printed"],
      [false, "no type checking errors & empty string is printed"],
      [false, "no type checking errors & exception is raised"],
      [true, "no type checking errors & %None% is printed"],
    ],
    explanation: `
      <p>
      <a href="https://github.com/python/typeshed/blob/d1d5fe58664b30a0c2dde3cd5c3dc8091f0f16ae/stdlib/re.pyi#L91">
        %Match[str].re%
      </a>
      is annotated as returning %str | Any%. In reality, it returns %str | None%, %None% meaning that
      the group didn't match (as opposed to matching an empty string). %Any% was used instead of %None%
      because having to check for %None% when you <i>know</i> that a particular group is always present
      would be inconvenient. (see:
      <a href="https://typing.python.org/en/latest/guides/writing_stubs.html#the-any-trick">
        "The Any Trick"
      </a>)
      </p>
      <p>
      So be careful: sometimes type annotations, especially type stubs, are not totally accurate
      and may make tradeoffs that you don't like. Stubs and library annotations do not
      change depending on the strictness settings of your type checker.
      </p>
    `
  },
]

export function init() {
  // Initialize list
  const quizSelectorNode = document.getElementById("quiz-selector")
  assert(quizSelectorNode)
  let index = 0
  for (const item of quizItems) {
    const li = document.createElement("li")
    const link = document.createElement("a")
    link.href = urlForQuizItem(index, item.id)  // for e.g. "open in new tab"
    link.innerHTML = escapeMonospace(item.title)

    let i = index  // closure gotcha: make sure event handler has the right index
    link.addEventListener("click", (e) => {
      selectQuizItem(i, true)
      e.preventDefault()
    })

    li.appendChild(link)
    quizSelectorNode.appendChild(li)
    index += 1
  }

  // Initialize the main content
  const quizPlaceNode = document.getElementById("quiz-place")
  assert(quizPlaceNode)

  const quizSelectorDetails = document.getElementById("quiz-selector-details")
  assert(quizSelectorDetails instanceof HTMLDetailsElement)
  if (window.matchMedia("(width >= 52.00rem)").matches) {
    quizSelectorDetails.open = true
  }

  const search = new URLSearchParams(window.location.search)
  let currentIndex = getSavedIndex(search.get("quiz-pos") || "", quizItems)

  window.addEventListener("popstate", (event) => {
    // When pressing back/forward without reloading the page, select the correct quiz item
    if (!event.target instanceof Window)
      return
    const search = new URLSearchParams(event.target.location.search)
    currentIndex = getSavedIndex(search.get("quiz-pos") || "", quizItems)
    selectQuizItem(currentIndex)
  })

  function selectQuizItem(index, saveToHistory = false) {
    const onPrev = index === 0 ? null : goBack
    const onNext = index === quizItems.length - 1 ? null : goNext
    const quizItem = quizItems[index]
    assert(quizItem, () => `missing at index ${index}`)

    if (saveToHistory)
      saveIndex(index, quizItem.id)

    const frag = buildQuizNode(
      quizItem,
      { onPrev, onNext },
      { current: index + 1, max: quizItems.length })
    quizPlaceNode.innerHTML = ""
    quizPlaceNode.appendChild(frag)
  }

  function goNext() {
    currentIndex++
    selectQuizItem(currentIndex, true)
  }

  function goBack() {
    currentIndex--
    selectQuizItem(currentIndex, true)
  }

  selectQuizItem(currentIndex, true)
}


/** Change the URL to reflect the given quiz item being selected */
function saveIndex(index, id) {
  history.pushState(null, "", urlForQuizItem(index, id))
}

function urlForQuizItem(index, id) {
  const url = new URL(window.location)
  url.searchParams.set("quiz-pos", `${index}_${id}`)
  return url
}

/** Decide which index a query string value refers to.
  * When in doubt, returns 0. */
function getSavedIndex(queryStr, items) {
  const match = /([1-9][0-9]*)_([-_a-zA-Z0-9]+)/.exec(queryStr)
  if (!match)
    return 0
  const index = parseInt(match[1], 10)
  const id = match[2]

  if (index >= items.length)
    return 0
  const item = items[index]

  // if it's the same index but not the same ID, it's likely that
  // the quiz contents changed substantially
  return id === item.id ? index : 0
}

function buildQuizNode(quizItem, { onNext, onPrev }, progress) {
  // See: a <template> tag in `index.html` with the ID of `quiz-item-template`.

  const quizItemTemplate = document.getElementById("quiz-item-template")
  assert(quizItemTemplate instanceof HTMLTemplateElement)

  const fragment = document.importNode(quizItemTemplate.content, true)

  const progressNode = fragment.querySelector("[part=progress]")
  assert(progressNode instanceof HTMLAnchorElement)
  if (onPrev) {
    progressNode.textContent = `⬅ ${progress.current}/${progress.max} `
    progressNode.addEventListener("click", () => onPrev())
  } else {
    progressNode.textContent = `  ${progress.current}/${progress.max} `
    progressNode.ariaDisabled = true
    progressNode.removeAttribute("href")
  }

  const titleNode = fragment.querySelector("[part=title]")
  titleNode.innerHTML = escapeMonospace(quizItem.title)

  const bodyNode = fragment.querySelector("[part=text]")
  bodyNode.innerHTML = escapeMonospace(quizItem.body)

  const answersNode = fragment.querySelector("[part=answers]")
  assert(
    answersNode instanceof HTMLUListElement
    || answersNode instanceof HTMLOListElement)

  for (const [isCorrect, answer] of quizItem.answers) {
    const li = document.createElement("li")
    if (isCorrect)
      li.dataset.isCorrectAnswer = true
    li.innerHTML = escapeMonospace(answer)

    answersNode.appendChild(li)
  }

  const explanationNode = fragment.querySelector("[part=explanation]")
  explanationNode.innerHTML = escapeMonospace(quizItem.explanation)

  const nextBtn = fragment.querySelector("[part=next-btn]")
  assert(nextBtn instanceof HTMLButtonElement)
  if (onNext) {
    nextBtn.addEventListener("click", () => onNext())
  } else {
    nextBtn.disabled = true
  }

  for (const codeBlock of fragment.querySelectorAll(".code-block")) {
    codeBlock.textContent = dedent(codeBlock.textContent)
  }

  return fragment
}

/**
 * See [textwrap.dedent](https://docs.python.org/3/library/textwrap.html#textwrap.dedent)
 * @param {string} s
 * @returns {string} */
function dedent(s) {
  s = s.replaceAll(/^\n*/g, "").replaceAll(/\s*$/g, "")
  const lines = s.split("\n")
  const firstLine = lines[0] || ""
  const trimAmount = /^[ ]*/g.exec(firstLine)[0].length
  const trimRegexp = new RegExp("^[ ]{0," + trimAmount + "}", "g")
  return lines.map(line => line.replaceAll(trimRegexp, "")).join("\n")
}

/**
 * @param {unknown} condition
 * @param {string} message?
 * @returns {asserts condition} */
function assert(condition, message = () => "Assertion error") {
  if (!condition) throw new Error(message())
}

/**
 * @param {string} str
 * @returns {string} */
function escapeMonospace(str) {
  return str
    .replaceAll(/%%%([^%]+)%%%/g, (_, p1) => `<div class="code-block">\n${escapeHTML(p1)}\n</div> `)
    .replaceAll(/%([^%]+)%/g, (_, p1) => `<code>${escapeHTML(p1)}</code>`)
    .replaceAll("%%", "%")
}

/**
 * @param {string} str
 * @returns {string} */
function escapeHTML(str) {
  // Is there really no better way to do this?
  const p = document.createElement("p")
  p.appendChild(document.createTextNode(str))
  return p.innerHTML
}
