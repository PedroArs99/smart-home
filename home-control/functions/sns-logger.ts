import { SnsEvent } from "../types/SnsEvent";

module.exports.handler = async (event: SnsEvent<any>) => {
  console.info("EVENT\n" + JSON.stringify(event, null, 2));
};
