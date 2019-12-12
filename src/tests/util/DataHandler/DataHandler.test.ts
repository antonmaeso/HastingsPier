import { DataHandler } from "../../../app/core/util/DataHandler/DataHandler";

test("Unit test read method called when file has already been created", () => {
  const dataHandler = DataHandler.createDataHandler();
  const mockCreate = jest.spyOn(dataHandler, "create"); // spy on create
  mockCreate.mockImplementation(() => false); // mock result for create
  const spyOnRead = jest.spyOn(dataHandler, "read"); //spy on read to see if we call it
  spyOnRead.mockImplementation(() => ""); //default value
  dataHandler.readOrCreateThenRead("", ""); // run method we are testing
  expect(spyOnRead).toHaveBeenCalled(); // success if spy called
});
