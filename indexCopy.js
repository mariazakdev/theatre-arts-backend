// const { describe } = require("node:test");

// describe("Test of Numbers", () => {
//     test("1 plus 1 is two", () => {
//         let a = 1;
//         let b = 1;

//         expect(a + b).toBe(2);
//     });

//     test("2 plus 5 is not four", () => {
//         a = 2;
//         b = 5;

//         expect(a + b).not.toBe(4);
//     });
// });

//  describe("Test of Strings", () => {
//     test("There is no I in team", () => {
//         expect("team").not.toMatch(/I/);
//     });

//     test("But there is a stop in Christoph", () => {
//         expect("Christoph").toMatch(/stop/);
//     }); 

//     test("The word 'stop' is in Christoph", () => { 
//         expect("Christoph").toMatch(/stop/);
//     });
// });
// describe("Test of Arrays", () => {
//     const shoppingList = [
//         "diapers",
//         "kleenex",
//         "trash bags",
//         "paper towels",
//         "beer",
//     ];

//     test("The shopping list has beer on it", () => {
//         expect(shoppingList).toContain("beer");
//     });
// }); 

// describe("Test of Objects", () => {     


//     test("The user object is correct", () => {
//         const user = {
//             name: "John",
//             age: 31,
//         };

//         expect(user).toEqual({
//             name: "John",
//             age: 31,
//         });
//     });
// }); 

// describe("var matcher", () => {
// test("var is undefined", () => {
//     const n = null;
//     expect(n).toBeNull();
//     expect(n).toBeDefined();
//     expect(n).not.toBeUndefined();
//     expect(n).not.toBeTruthy();
//     expect(n).toBeFalsy();
// });
// });