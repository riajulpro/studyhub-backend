"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripePaymentIntent = void 0;
const app_1 = require("../app");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createStripePaymentIntent = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const payAmount = Math.round(Number(amount) * 100); // Convert to smallest currency unit (cents)
    console.log("aaaaaaaaa", amount);
    try {
        // const session = await stripe.checkout.sessions.create({
        //   payment_method_types: ['card'],
        //   line_items: [{
        //     price_data: {
        //       currency: 'bdt',
        //       product_data: {
        //         name: 'Total Purchase',
        //       },
        //       unit_amount: payAmount,
        //     },
        //     quantity: 1,
        //   }],
        //   mode: 'payment',
        //   success_url: 'http://localhost:3000/success',
        //   cancel_url: 'http://localhost:3000/cancel',
        // });
        const paymentIntent = yield app_1.stripe.paymentIntents.create({
            amount: payAmount,
            currency: "gbp",
            payment_method_types: ["card"],
        });
        (0, sendResponse_1.default)(res, {
            data: paymentIntent.client_secret,
            message: "Successfully created payment session",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
// export const confirmPaymentController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const body = req.body;
//   const isExist = await findUserByEmailOrNumber(body.emailOrNumber);
//   if (isExist) {
//     return sendResponse(res, {
//       data: null,
//       message: "User already exists with this email or number",
//       statusCode: 400,
//       success: false,
//     });
//   }
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const result = await User.create([body], { session });
//     const customerAddress = await CustomerAddress.create([body], { session });
//     // const newCreditUp = new CreditUp(body.creditUp);
//     const creditUP = await CreditUp.create([{ credits: body.creditUp }], {
//       session,
//     });
//     const customerDetails = await CustomerDetails.create([body], { session });
//     const circumstances = await Circumstances.create([body], { session });
//     const bodyReplica = { ...body };
//     [
//       "customerAddress",
//       "auth",
//       "creditUp",
//       "customerDetail",
//       "circumstances",
//     ].forEach((val) => delete bodyReplica[val]);
//     const customerObj = {
//       customerAddress: customerAddress[0]._id,
//       auth: result[0]._id,
//       creditUp: creditUP[0]._id,
//       customerDetail: customerDetails[0]._id,
//       circumstances: circumstances[0]._id,
//       ...bodyReplica,
//     };
//     console.log(customerObj);
//     const customer = await Customer.create([customerObj], {
//       session,
//     });
//     const { password, ...user } = result[0].toObject();
//     const token = createToken(user, "7d");
//     const { creditUp, ...rest } = req.body;
//     const sheetArr: Record<string, unknown> = { ...rest };
//     // [
//     //   {
//     //     "lender": "Bank of Example",
//     //     "outstandingBalance": 15000.50,
//     //     "contribute": 300.75
//     //   },
//     //   {
//     //     "lender": "Example Credit Union",
//     //     "outstandingBalance": 8200.00,
//     //     "contribute": 150.00
//     //   }
//     // ]
//     creditUp.forEach((data: any) => {
//       sheetArr.lender = `${sheetArr.lender || ""}, ${data.lender}`;
//       sheetArr.outstandingBalance = `${sheetArr.outstandingBalance || ""}, ${
//         data.outstandingBalance
//       }`;
//       sheetArr.contribute = `${sheetArr.contribute || ""}, ${data.contribute}`;
//     });
//     // add data in sheet
//     appendDataInSheetController(sheetArr);
//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({
//       data: user,
//       message: "User created successfully",
//       statusCode: 200,
//       success: true,
//       token,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error);
//     next(error);
//     sendResponse(res, {
//       data: null,
//       message: "Failed to create user",
//       statusCode: 500,
//       success: false,
//     });
//   }
// };
