import "@testing-library/jest-dom"; // Extends Jest matchers for better assertions on DOM nodes



Object.defineProperty(window, "matchMedia", { // Define a property on the window object for checking responsive media queries
  writable: true, // Allow the property to be modified if needed 
  value: (query: string) => ({ // Function that takes a media query string and returns an object simulating the MediaQueryList interface
    matches: false, // If query not matched, return false and responsive behavior won't change
    media: query, //Save the query in string
    onchange: null, // If screen Size changes, this will be null/safe
    //They Describe dummmy methods to avoid errors/crash during tests
    addListener: () => {}, 
    removeListener: () => {}, 
    addEventListener: () => {}, 
    removeEventListener: () => {},
    dispatchEvent: () => {}, 
  }),
});

//LocalStorage, alert, scrollTo, navigator.geolocation mocks can be added here if needed for tests to avoid errors /crashing