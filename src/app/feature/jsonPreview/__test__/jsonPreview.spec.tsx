import renderer from "react-test-renderer";
import { JsonPreview } from "../jsonPreview";

describe("jsonPreview snapshot", () => {
  global.URL.canParse = jest.fn();
  jest.spyOn(chrome.runtime, "sendMessage");
  it("json preview", async () => {
    const json = {
      posts: [{ id: 1, title: "json-server", author: "typicode" }],
      comments: [{ id: 1, body: "some comment", postId: 1 }],
      profile: {
        name: "John Doe",
        age: 30,
        url: "https://example.com",
        address: {
          city: "New York",
          postal_code: "10001",
          street: {
            name: "Broadway",
            number: 123,
            apartment: {
              floor: 5,
              number: 502,
            },
          },
        },
        contact: {
          email: "john.doe@example.com",
          phone: {
            home: "123-456-7890",
            work: "987-654-3210",
          },
        },
        interests: ["programming", "hiking", "reading"],
        test: [{ a: 1 }, { a: 2 }, { a: 3 }],
      },
    };

    const tree = renderer
      .create(<JsonPreview targetJson={JSON.parse(JSON.stringify(json))} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
