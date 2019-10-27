import { DataHandler } from "../../../app/core/util/DataHandler/DataHandler";

test("test read method called when file has already been created", () => {
  const foo = new DataHandler();
  const mockAddListener = jest.spyOn(foo, "create"); // spy on create
  mockAddListener.mockImplementation(() => false); // mock result for create
  const spyOnRead = jest.spyOn(foo, "read"); //spy on read to see if we call it
  spyOnRead.mockImplementation(() => "");
  foo.readOrCreateThenRead("", ""); // run method we are testing
  expect(spyOnRead).toHaveBeenCalled(); // success if spy called
});
