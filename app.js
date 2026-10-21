const tribute = window.TRIBUTE;

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

const gallery = document.getElementById("gallery");
tribute.gallery.forEach((memory, index) => {
  const card = element("figure", "memory-card reveal");
  const frame = element("div", "memory-frame");
  const fallback = element("div", "memory-placeholder");
  fallback.append(element("span", "placeholder-icon", "✦"), element("span", "placeholder-number", String(index + 1).padStart(2, "0")), element("span", "placeholder-label", "ADD YOUR PHOTO"));
  frame.append(fallback);
  if (memory.image) {
    const photo = element("img", "memory-photo");
    photo.src = memory.image;
    photo.alt = memory.caption.replace(/^\[|\]$/g, "") || `Memory ${index + 1}`;
    photo.loading = "lazy";
    photo.onerror = () => photo.remove();
    frame.append(photo);
  }
  const caption = element("figcaption", "memory-caption");
  caption.append(element("span", "caption-index", `MEMORY ${String(index + 1).padStart(2, "0")}`), element("p", "", memory.caption));
  card.append(frame, caption);
  gallery.append(card);
});

const letterParagraphs = document.getElementById("letter-paragraphs");
tribute.letter.forEach(paragraph => letterParagraphs.append(element("p", "", paragraph)));
document.getElementById("letter-signoff").textContent = tribute.signoff;

const legacyGrid = document.getElementById("legacy-grid");
tribute.lessons.forEach((lesson, index) => {
  const card = element("article", "legacy-card reveal");
  card.append(element("span", "legacy-index", String(index + 1).padStart(2, "0")), element("span", "legacy-icon", "✦"), element("h3", "", lesson.title), element("p", "", lesson.detail));
  legacyGrid.append(card);
});

const surpriseButton = document.getElementById("surprise-button");
const surprisePanel = document.getElementById("surprise-panel");
surpriseButton.addEventListener("click", () => {
  const isOpen = surpriseButton.getAttribute("aria-expanded") === "true";
  surpriseButton.setAttribute("aria-expanded", String(!isOpen));
  surpriseButton.firstChild.textContent = isOpen ? "Open your surprise " : "Close your surprise ";
  surprisePanel.hidden = isOpen;
  if (isOpen || surprisePanel.childNodes.length) return;
  surprisePanel.append(element("p", "surprise-label", "A MESSAGE FOR PAPA"));
  const { type, file, message } = tribute.surprise;
  if (file && (type === "video" || type === "audio")) {
    const media = element(type, "surprise-media");
    media.controls = true;
    media.preload = "metadata";
    media.src = file;
    surprisePanel.append(media);
  }
  surprisePanel.append(element("p", "surprise-message", message));
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(node => observer.observe(node));
} else {
  document.querySelectorAll(".reveal").forEach(node => node.classList.add("visible"));
}
