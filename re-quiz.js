"use strict";

/** %monospace%, %%%monospace block%%% */
const quizItems = [
  {
    id: "warmup",
    title: "Warm-up",
    body: `
      <p>
      This is a quiz that demonstrates some complexity, surprising
      behaviour and common mistakes with Python's standard library
      %re% module.
      </p>

      <p>
      This quiz assumes that %re% has already been imported.
      </p>

      %%%
      print(re.search("[a-z]+", "banana"))
      %%%

      <p>
      What's the output of this program?
      </p>
    `,
    answers: [
      "%'banana'%",
      "!!%<re.Match object; span=(0, 6), match='banana'>%",
      "%None%",
      "an exception",
    ],
    correctAnswer: `
      <p>
      %re.search%, %re.fullmatch%, and %re.match% all produce %re.Match% objects.
      </p>
    `
  },

  {
    id: "match-misnomer",
    title: "Validation",
    body: String.raw`
      %%%
      if re.match(r"[a-z]+@[a-z]+\.[a-z]+", "alice@b.com.кц.рф"):
          print("valid")
      else:
          print("invalid")
      %%%

      <p>
      What's the output of this program?
      </p>
    `,
    answers: [
      "!!%valid%",
      "%invalid%",
      "an exception",
    ],
    correctAnswer: `
      <p>
      %re.match% searches for a pattern at the start of a string, but it does not
      ensure that the entire string matches the pattern.
      </p>

      %%%
      >>> re.match(r"[a-z]+@[a-z]+\.[a-z]+", "alice@b.com.кц.рф")
      <re.Match object; span=(0, 11), match='alice@b.com'>
      >>>
      %%%
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
      "error: you can't add %str% and %int%",
      "error: you're returning an %int%, but the function is annotated as returning %str%",
      "error/warning: a generic type is missing a type argument",
      "!!everything is fine",
    ],
    correctAnswer: `
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
      "type checking error & %None% is printed",
      "no type checking errors & empty string is printed",
      "no type checking errors & exception is raised",
      "!!no type checking errors & %None% is printed",
    ],
    correctAnswer: `
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
  const placeNode = document.getElementById("quiz-place")
  assert(placeNode instanceof HTMLElement)

  const search = new URLSearchParams(window.location.search)
  let currentIndex = getSavedIndex(search.get("quiz-pos") || "", quizItems);
  const maxIndex = quizItems.length - 1;

  window.addEventListener("popstate", (event) => {
    if (!event.target instanceof Window)
      return

    const search = new URLSearchParams(event.target.location.search)
    currentIndex = getSavedIndex(search.get("quiz-pos") || "", quizItems);
    selectQuizItem(currentIndex)
  })

  function selectQuizItem(index, saveToHistory = false) {
    const onPrev = index === 0 ? null : goBack
    const onNext = index === maxIndex ? null : goNext
    const quizItem = quizItems[index]

    if (saveToHistory)
      saveIndex(index, quizItem.id)

    const frag = buildQuizNode(
      quizItem,
      { onPrev, onNext },
      { current: index + 1, max: quizItems.length })
    placeNode.innerHTML = ""
    placeNode.appendChild(frag)
  }

  function goNext() {
    currentIndex++;
    selectQuizItem(currentIndex, true)
  }

  function goBack() {
    currentIndex--;
    selectQuizItem(currentIndex, true)
  }

  selectQuizItem(currentIndex, true)
}

/** Change the URL to reflect the given quiz item being selected */
function saveIndex(index, id) {
  const url = new URL(window.location)
  url.searchParams.set("quiz-pos", `${index}_${id}`)
  history.pushState(null, "", url)
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

  for (const answer of quizItem.answers) {
    const li = document.createElement("li")
    let text = escapeMonospace(answer)
    if (text.startsWith("!!")) {
      text = text.replace(/^!!/, "")
      li.dataset.isCorrectAnswer = true
    }
    li.innerHTML = text;

    answersNode.appendChild(li)
  }

  const correctAnswerNode = fragment.querySelector("[part=correct-answer]")
  correctAnswerNode.innerHTML = escapeMonospace(quizItem.correctAnswer)

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
  s = s.replaceAll(/^\n*/g, "").replaceAll(/\s*$/g, "");
  const lines = s.split("\n")
  const firstLine = lines[0] || "";
  const trimAmount = /^[ ]*/g.exec(firstLine)[0].length;
  const trimRegexp = new RegExp("^[ ]{0," + trimAmount + "}", "g")
  return lines.map(line => line.replaceAll(trimRegexp, "")).join("\n")
}

/**
 * @param {unknown} condition
 * @param {string} msg?
 * @returns {asserts condition} */
function assert(condition, msg = "") {
  if (!condition) throw new Error(msg)
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

/** @param {string} str */
function escapeHTML(str) {
  // Is there really no better way to do this?
  const p = document.createElement("p")
  p.appendChild(document.createTextNode(str))
  return p.innerHTML
}