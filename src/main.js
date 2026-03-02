
let content = "";

const main = BpmnEditor.open({
    container: document.getElementById("editor-container"),
    initialContent: Promise.resolve(
        content
    ),
    readOnly: false,
});

// Menubar logic
document.querySelectorAll(".menu-item").forEach((item) => {
    const button = item.querySelector(".menu-button");

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains("open");
        closeAllMenus();
        if (!isOpen) {
            item.classList.add("open");
        }
    });
});

document.addEventListener("click", () => {
    closeAllMenus();
});

function closeAllMenus() {
    document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("open");
    });
}

// File > Open File
document.getElementById("menu-open-file").addEventListener("click", async () => {
    closeAllMenus();
    try {
        const filePath = await window.krema.invoke("dialog:openFile", {
            title: "Open BPMN File",
            filters: [{ name: "BPMN Files", extensions: ["bpmn", "bpmn2", "xml"] }],
        });
        if (filePath) {
            const fileContent = await window.krema.invoke("fs:readTextFile", { path: filePath });
            if (fileContent) {
                content = fileContent;
                BpmnEditor.open({
                    container: document.getElementById("editor-container"),
                    initialContent: Promise.resolve(content),
                    readOnly: false,
                });
            }
        }
    } catch (err) {
        console.error("Failed to open file:", err);
    }
});

// File > Quit
document.getElementById("menu-quit").addEventListener("click", () => {
    closeAllMenus();
    window.krema.invoke("quit");
    window.close();
});

// Help > About
document.getElementById("menu-about").addEventListener("click", () => {
    closeAllMenus();
    alert("Bpmn Desk v0.1.0\nA BPMN editor desktop application.");
});
