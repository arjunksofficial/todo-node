function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    sourceprio=ev.srcElement.id;
    ev.dataTransfer.setData("text",ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var source =array[data-1].status;
    var destination =ev.srcElement.id;
    if (source==="todo" && (destination==="progress"|| destination==="progressmain"|| array[destination-1].status==="progress")){
        moveTask(data);
        ev.target.appendChild(document.getElementById(data));

    } else if (source==="progress" && (destination==="done" || destination==="donemain" || array[destination-1].status==="done")){
        moveTask(data);
        ev.target.appendChild(document.getElementById(data));

    }
    updatePageWithPrio();
}