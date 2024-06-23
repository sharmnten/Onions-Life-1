export function optimizeLevel(map) {
    let newMap = map.slice();
    newMap = checkLevel(newMap); // Assuming checkLevel does not mutate its input

    for (var i = 0; i < newMap.length; i++) {
        newMap[i] = newMap[i].replaceAll("=====", "  +  ");
        newMap[i] = newMap[i].replaceAll("  +    +    +    +    +  ", "            _            ");
        newMap[i] = newMap[i].replaceAll("iiiiiiiiiiiiiiiiiiiiiiiii", "            ~            ");
        newMap[i] = newMap[i].replaceAll("            ~                        ~                        ~            ", "                                #                                ");
        //newMap[i] = newMap[i].replaceAll("^^^^^^^^^", "    &    ");
        //newMap[i] = newMap[i].replaceAll("^^^", " ` ");
    }

    return newMap;
}

function removeTiles(map, start, end, tile, col) {
    if (tile == "=") {
        for (var i = start; i < end; i++) {
            map[i] = replaceChar(map[i], col)
        }
    }
    return map
}

function addCollision(start, end, tile, col) {
    if (tile == "=") {
        add([
            body({ isStatic: true, mass: 5 }),
            pos(col* 64, end * 64),
            area({ shape: new Rect(vec2(0, 0), 64, (end * 64) - (start * 64)) }),
            offscreen({ hide: true, distance: (end * 64) - (start * 64)}),
            anchor("bot"),
            z(-1),
            {
                draw() {
                    drawSprite({
                        sprite: "grass",
                        pos: vec2(col * 64, start * 64) - 64,
                        width: 64,
                        height: (end * 64) - (start * 64),
                        tiled: true,
                        anchor: "bot"
                    })
                }
            }
        ])
    }
}

function checkColumn(map, column) {
    let startCoord;
    for (var i = 0; i < map.length; i++) {
        if (map[i].charAt(column) == "=") {
            if (i == 0) {
                startCoord = 0;
            } else if (i == 1) {
                if (map[i].charAt(column) != map[i - 1].charAt(column)) {
                    startCoord = 1;
                }
            } else if (i == map.length - 1) {
                if (map[i].charAt(column) == map[i - 1].charAt(column)) {
                    map = removeTiles(map, startCoord, i, map[i].charAt(column), column)
                    addCollision(startCoord - 1, i, map[i].charAt(column), column)
                }
            } else if (map[i].charAt(column) == map[i - 1].charAt(column)) {
                if (map[i - 1].charAt(column) != map[i - 2].charAt(column)) {
                    startCoord = i - 1;
                }
                if (map[i].charAt(column) != map[i + 1].charAt(column)) {
                    map = removeTiles(map, startCoord, i, map[i].charAt(column), column)
                    addCollision(startCoord - 1, i, map[i].charAt(column), column)
                }
            }
        }
    }
    return map
}

export function checkLevel(map) {
    let newMap = map.slice();
    for (var i = 0; i < newMap[0].length; i++) {
        newMap = checkColumn(newMap, i);
    }
    return newMap
}

// code that isn't stolen off the internet
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
function replaceChar(orig, index) {
    let first = orig.substr(0, index);
    let last = orig.substr(index + 1);

    let newStr = first + " " + last;
    return newStr
}
