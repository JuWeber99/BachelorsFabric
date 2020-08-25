import * as moment from "moment";

export const stanniSub = {
    callThreshold: moment.duration(100, "minutes").toISOString(),
    dataUsageThresholdInMb: 5000,
    smsThreshold: 200,
    productId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    productType: "subscription",
    amount: 10
}