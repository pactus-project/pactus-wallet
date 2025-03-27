import { sprintf } from "./utils"; // Adjust the import path if necessary

describe("sprintf function", () => {
    test.each([
        ["Hello, %s!", ["Mo"], "Hello, Mo!"],
        ["You have %d messages.", [5], "You have 5 messages."],
        ["%s has %d apples and %d oranges.", ["Mo", 3, 5], "Mo has 3 apples and 5 oranges."],
        ["User: %s, Age: %d, Score: %d", ["Alice", 30, 95], "User: Alice, Age: 30, Score: 95"],
        ["No placeholders here.", [], "No placeholders here."],
        ["Hello, %s!", ["Mo", 42], "Hello, Mo!"], // Extra arguments should be ignored
        ["Hello, %s! You have %d messages.", ["Mo"], "Hello, Mo! You have %d messages."], // Missing argument
        ["Value: %x, Name: %s", [255, "Hex"], "Value: %x, Name: Hex"], // Unsupported placeholder
        ["Path: %s, Size: %dMB", ["/usr/local", 100], "Path: /usr/local, Size: 100MB"],
    ])("formats '%s' with args %p to '%s'", (format, args, expected) => {
        expect(sprintf(format, ...args)).toBe(expected);
    });
});
