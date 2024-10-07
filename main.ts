let idleTimeout = 10000; // 5 seconds of idle time
let lastCommandTime = input.runningTime(); // Time of the last command
let idleMode = false; // Track if we're in idle mode

radio.onReceivedString(function (command) {
    lastCommandTime = input.runningTime(); // Reset the last command time
    idleMode = false; // Reset idle mode

    if (command == "Left") {
        basic.showArrow(ArrowNames.East);
        motion.turnLeft(50);
        basic.pause(500);
        motion.stop();
        basic.clearScreen();
    } else if (command == "Right") {
        basic.showArrow(ArrowNames.West);
        motion.turnRight(50);
        basic.pause(500);
        motion.stop();
        basic.clearScreen();
    } else if (command == "Backward") {
        basic.showArrow(ArrowNames.South);
        motion.driveStraight(-50);
        basic.pause(500);
        motion.stop();
        basic.clearScreen();
    } else if (command == "Forward") {
        basic.showArrow(ArrowNames.North);
        motion.driveStraight(50);
        basic.pause(500);
        motion.stop();
        basic.clearScreen();
    } else {
        motion.stop();
    }
});

// Function for stopping the motors safely
function stopMotors() {
    console.log("Motors stopping...");
    servos.setLeftServoPosition(Position.UP);
    motion.stop();
}

// Safety and startup checks
function checkForErrors() {
    runSafely(() => PlaySound("Startup"), "PlaySound");
    runSafely(() => stopMotors(), "stopMotors");
    runSafely(() => move(ArrowNames.North, () => console.log("Moved North")), "move");
}

// Function for playing sounds
let StartupPlayed = false;
let soundPlayed = false;

function PlaySound(Sound: any) {
    console.log("PlaySound called with argument: " + Sound);

    if (typeof (Sound) == "string") {
        if (Sound == "Beep") {
            console.log("Sound is 'Beep'");
            if (!soundPlayed) {
                console.log("Beep sound not played yet, playing sound...");
                soundPlayed = true;
                music.playTone(Note.A, 500);
                pause(500);
                music.playTone(Note.B, 500);
            } else {
                console.log("Beep sound already played, skipping...");
            }
        } else if (Sound == "Startup") {
            console.log("Sound is 'Startup'");
            if (!StartupPlayed) {
                console.log("Startup sound not played yet, starting loading animation...");
                StartupPlayed = true;

                for (let i = 0; i < 3; i++) {
                    console.log("Loading animation frame " + (i + 1));
                    basic.showLeds(`
                        . . # . .
                        . # . # .
                        # . . . #
                        . # . # .
                        . . # . .
                    `);
                    basic.pause(200);
                    basic.showLeds(`
                        . # . # .
                        # . . . #
                        . . . . .
                        # . . . #
                        . # . # .
                    `);
                    basic.pause(200);
                    basic.showLeds(`
                        # . . . #
                        . # . # .
                        . . # . .
                        . # . # .
                        # . . . #
                    `);
                    basic.pause(200);
                }

                console.log("Startup sound playing...");
                music.playTone(Note.A, 500);
                music.playTone(Note.B, 500);
                music.playTone(Note.C, 500);

                console.log("Displaying 'Yes' icon...");
                basic.showIcon(IconNames.Yes);
                pause(100);
                basic.clearScreen();
            } else {
                console.log("Startup sound already played, skipping...");
            }
        }
    } else {
        console.log("Invalid sound type, showing error code...");
        basic.showString("Error Code:");
        pause(100);
        basic.showNumber(23);
        basic.clearScreen();
    }
}

// Function for movement with direction and action
function move(direction: ArrowNames, action: () => void) {
    console.log("Moving in direction: " + direction);
    basic.showArrow(direction);
    basic.pause(1000);
    basic.clearScreen();
    action();
}

function runSafely(fn: any, fnName = "anonymous") {
    try {
        console.log(`Running function: ${fnName}`);
        fn();
        console.log(`Function ${fnName} executed successfully.`);
    } catch (error) {
        console.error(`Error in function ${fnName}: ${error.message}`);
    }
}

function playIdleAnimation() {
    if (!idleMode) {
        console.log("Entering idle mode, playing cool tune...");
        music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.OnceInBackground);
        idleMode = true;
    }

    basic.showLeds(`
        . # # # .
        # . . . #
        # . . . #
        # . . . #
        . # # # .
    `);
    basic.pause(200);
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
    `);
    basic.pause(200);
    basic.showLeds(`
        . # # # .
        # . . . #
        # # . # #
        # . . . #
        . # # # .
    `);
    basic.pause(200);
    basic.showLeds(`
        . . # . .
        . # . # .
        # . . . #
        . # . # .
        . . # . .
    `);
    basic.pause(200);
    basic.clearScreen();
}

basic.forever(function () {
    if (input.runningTime() - lastCommandTime > idleTimeout) {
        playIdleAnimation();
    } else {
        idleMode = false;
    }
});

checkForErrors();

runSafely(() => {
    console.log("Setting radio group to 4...");
    radio.setGroup(4);
}, "Setting radio group");
