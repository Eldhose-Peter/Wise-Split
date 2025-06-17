import { Amount } from "../Design/models/Amount";

describe("Amount", () => {
  it("should create an Amount instance", () => {
    const amount = new Amount("US", 100);
    expect(amount.getAmount()).toBe(100);
  });
});
