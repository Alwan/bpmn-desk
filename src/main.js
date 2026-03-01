
let content = "";

const main = BpmnEditor.open({
    container: document.getElementById("editor-container"),
    initialContent: Promise.resolve(
        content
    ),
    readOnly: false,
});



