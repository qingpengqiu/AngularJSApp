declare var window: any;
/**
 * 上传附件 服务器地址
 */
export const serverAddress: string = "http://10.0.1.26:88";

/**
 * 产品明细  模板地址
 */
export const producttpladdress = "http://" + window.location.host + "/dboms/assets/downloadtpl/产品明细模板.xlsx";
/**
 * 多送货地址 模板地址
 */
export const multipleAddress = "http://" + window.location.host + "/dboms/assets/downloadtpl/多送货地址模板.xlsx";

/**
 * 电子合同 业务处理公共类
 */
export class EcContractCommonClass {

    /**
     * 付款方式 数据源
     */
    Payment: Array<any> = [{ id: 'Ticket', text: '(1)' }, { id: 'Transfer', text: '(2)' }, { id: 'Once-Period', text: '(3)' }, { id: 'Period-Period', text: '(4)' }, { id: 'Full', text: '(5)' }, { id: 'Once-Period2', text: '(6)' }, { id: 'Customize', text: '(7)' }];
    
    /**根据templateID 返回电子合同页面路由地址 */
    returnECRouterUrlByTemplateID(templateID) {
        let ecPageRouteUrl = "/india/tplmake";
        switch (templateID) {
            case "Inland_Hardware_Common"://硬件通用版
                ecPageRouteUrl = "/india/tplmake";
                break;
            case "Inland_Hardware_HuaSan"://硬件华三
                ecPageRouteUrl = "/india/hchinathree";
                break;
            case "Inland_Software_Standard"://软件标准
                ecPageRouteUrl = "/india/softwarestandard";
                break;
            case "Inland_Software_Micro"://软件微软
                ecPageRouteUrl = "/india/softwaremicro";
                break;
            case "Inland_Software_Adobe"://软件微软
                ecPageRouteUrl = "/india/softwareadobe";
                break;
            default://其它
                break;
        }
        return ecPageRouteUrl;
    }

    /**
     * 根据付款方式返回小标题
     */
    returnTitleByPayType(templateID, paymentType) {
        let title = "";
        switch (templateID) {
            case "Inland_Hardware_Common"://硬件通用版
                switch (paymentType) {
                    case "Ticket":
                        title = "票据方式一次性付清";
                        break;
                    case "Transfer":
                        title = "转账/电汇方式一次性付清";
                        break;
                    case "Once-Period":
                        title = "一次性交货，分批付款";
                        break;
                    case "Period-Period":
                        title = "分期交货，分期付款";
                        break;
                    case "Full":
                        title = "全款到账发货";
                        break;
                    case "Once-Period2":
                        title = "一次性交货，分批付款";
                        break;
                    default:
                        title = "自定义条款";
                        break;
                }
                break;
            case "Inland_Hardware_HuaSan"://硬件华三
                switch (paymentType) {
                    case "Ticket":
                        title = "票据方式一次性付清";
                        break;
                    case "Transfer":
                        title = "转账/电汇方式一次性付清";
                        break;
                    case "Once-Period":
                        title = "一次性交货，分批付款";
                        break;
                    case "Period-Period":
                        title = "分期交货，分期付款";
                        break;
                    case "Full":
                        title = "全款到账发货";
                        break;
                    case "Once-Period2":
                        title = "一次性交货，分批付款";
                        break;
                    default:
                        title = "自定义条款";
                        break;
                }
                break;
            case "Inland_Software_Standard"://软件标准
            case "Inland_Software_Micro"://软件微软
            case "Inland_Software_Adobe"://软件微软
                switch (paymentType) {
                    case "Ticket":
                        title = "票据方式一次性付清";
                        break;
                    case "Transfer":
                        title = "转账/电汇方式一次性付清";
                        break;
                    case "Once-Period":
                        title = "一次性交付，分批付款（票据）";
                        break;
                    case "Period-Period":
                        title = "分期交付，分期付款";
                        break;
                    case "Full":
                        title = "全款到账交付";
                        break;
                    case "Once-Period2":
                        title = "一次性交货，分批付款";
                        break;
                    default:
                        title = "自定义条款";
                        break;
                }
                break;
        }
        return title;
    }
    
    /**
     * 根据付款方式返回付款内容文本
     */
    returnPayItemByPayType(data, money?) {
        let content = "";
        let templateID = data["TemplateID"];
        let paymentType = data["PaymentType"];
        switch (templateID) {
            case "Inland_Hardware_Common"://硬件通用版
            case "Inland_Hardware_HuaSan"://硬件华三
                switch (paymentType) {
                    case 'Ticket':
                        content = `卖方发货前，买方交付给卖方一张自发货之日起${data.PayType_Ticket_Day}日的${data.PayType_Ticket_TypeName}用于支付合同货款（以款到卖方账户为准），${data.PayType_Ticket_TypeName}金额：${money}元。 在买方向卖方支付上述票据前，卖方有权拒绝发货并不承担逾期交货的违约责任；同时买方保证在卖方发货之日起${data.PayType_Ticket_Day}日内该票据能够足额兑付。如未能兑付或未能足额兑付，则买方仍应继续完成付款义务。`;
                        break;
                    case 'Transfer':
                        content = `买方于卖方发货之日起${data.PayType_Transfer_Day}日内付清货款。`;
                        break;
                    case 'Once-Period':
                        let temp = `合同总价款的${data.PayType_OP_Ratio}%(${data.PayType_OP_Money}元)`;
                        if (!data.PayType_OP_Ratio) {
                            temp = `${data.PayType_OP_Money}元`;
                        }
                        content = `本合同签订之日起三日内，买方向卖方支付${temp}作为预付款。卖方发货前，买方交付给卖方一张自发货之日起${data.PayType_OP_Day}日的${data.PayType_OP_TicketName}于支付合同货款（以款到卖方账户为准），${data.PayType_OP_TicketName}金额：${money}元。在买方向卖方支付合同约定预付款和上述票据前， 卖方有权拒绝发货并不承担逾期交货的违约责任；买方保证在卖方发货之日起${data.PayType_OP_Day}日内付清剩余货款，即${money}元。`;
                        break;
                    case 'Period-Period':
                        let tempPayType_OP_Ratio = `合同总价款的${data.PayType_PP_Ratio}%(${data.PayType_PP_Money}元)`;
                        if (!data.PayType_PP_Ratio) {
                            tempPayType_OP_Ratio = `${data.PayType_PP_Money}元`;
                        }
                        content = `本合同签订之日起三日内，买方向卖方支付${tempPayType_OP_Ratio}作为预付款， 买方需在每次发货前交付给卖方一张自发货之日起 ${data.PayType_PP_Day}日的${data.PayType_PP_TicketName}用于支付合同货款（以款到卖方账户为准）， ${data.PayType_PP_TicketName}金额等于每次发货的产品销售金额，在买方向卖方交付预付款和上述票据前，卖方有权拒绝发货并不承担逾期交货的违约责任；买方保证在卖方发货之日起  ${data.PayType_PP_Day}日内付清对应货款。本款约定之预付款仅用作冲抵最后一笔应付货款。`;
                        break;
                    case 'Full':
                        content = `买方于本合同生效之日起${data.PayType_Full_Day}日内向卖方一次性支付全部货款，卖方在收到买方全部货款后发货；在买方向卖方支付合同约定货款前，卖方有权拒绝发货并不承担逾期交货的违约责任。`;
                        break;
                    case "Once-Period2":
                        let PayType_OP2_Ratio = `合同总价款的${data.PayType_OP2_Ratio}%(${data.PayType_OP2_Money}元)`;
                        if (!data.PayType_OP2_Ratio) {
                            PayType_OP2_Ratio = `${data.PayType_OP2_Money}元`;
                        }
                        content = `本合同签订之日起${data.PayType_OP2_SignDay}日内，买方向卖方支付${PayType_OP2_Ratio}作为预付款，在买方向卖方支付合同约定预付款前，卖方有权拒绝发货并不承担逾期交货的违约责任，同时买方保证在卖方发货之日起${data.PayType_OP2_SendDay}日内付清剩余货款，即${money}元。`;
                        break;
                    default:
                        content = data.PayType_Customize;
                }
                break;
            case "Inland_Software_Standard"://软件标准
            case "Inland_Software_Micro"://软件标准
            case "Inland_Software_Adobe"://软件标准
                switch (paymentType) {
                    case 'Ticket':
                        content = `本合同生效之日起${data.PayType_Ticket_EffectiveDay}日内，买方交付给卖方一张自本合同生效之日起${data.PayType_Ticket_Day}日的${data.PayType_Ticket_TypeName}用于支付合同货款（以款到卖方账户为准），${data.PayType_Ticket_TypeName}金额：${money}元。 在买方向卖方支付上述票据前，卖方有权拒绝交付并不承担逾期交付的违约责任；同时买方保证在本合同生效之日起${data.PayType_Ticket_Day}日内该票据能够足额兑付。如未能兑付或未能足额兑付，买方应于应付款当日向卖方及时履行付款义务，同时，卖方有权按照本合同追究买方的违约责任。`;
                        break;
                    case 'Transfer':
                        content = `买方于本合同生效之日起${data.PayType_Transfer_Day}日内付清货款。`;
                        break;
                    case 'Once-Period':
                        let temp = `合同总价款的${data.PayType_OP_Ratio}%(${data.PayType_OP_Money}元)`;
                        if (!data.PayType_OP_Ratio) {
                            temp = `${data.PayType_OP_Money}元`;
                        }
                        content = `本合同生效之日起三日内，买方向卖方支付${temp}作为预付款。卖方发货前，买方交付给卖方一张自本合同生效之日起${data.PayType_OP_Day}日的${data.PayType_OP_TicketName}于支付合同货款（以款到卖方账户为准），${data.PayType_OP_TicketName}金额：${money}元。在买方向卖方支付合同约定预付款和上述票据前， 卖方有权拒绝发货并不承担逾期交货的违约责任；买方保证在本合同生效之日起${data.PayType_OP_Day}日内付清剩余货款，即${money}元。`;
                        break;
                    case 'Period-Period':
                        let tempPayType_OP_Ratio = `合同总价款的${data.PayType_PP_Ratio}%(${data.PayType_PP_Money}元)`;
                        if (!data.PayType_PP_Ratio) {
                            tempPayType_OP_Ratio = `${data.PayType_PP_Money}元`;
                        }
                        content = `卖方分批交付，本合同生效之日起三日内，买方向卖方支付${tempPayType_OP_Ratio}作为预付款， 买方需在每次发货前交付给卖方一张自本合同生效之日起 ${data.PayType_PP_Day}日的${data.PayType_PP_TicketName}用于支付合同货款（以款到卖方账户为准）， ${data.PayType_PP_TicketName}金额等于每次交付的产品销售金额，在买方向卖方交付预付款和上述票据前，卖方有权拒绝交付并不承担逾期交付的违约责任；买方保证在本合同生效之日起${data.PayType_PP_Day}日内付清对应货款。本款约定之预付款仅用作冲抵最后一笔应付货款。`;
                        break;
                    case 'Full':
                        content = `买方于本合同生效之日起${data.PayType_Full_Day}日内向卖方一次性支付全部货款，卖方在收到买方全部货款后交付；在买方向卖方支付合同约定货款前，卖方有权拒绝交付并不承担逾期交付的违约责任。`;
                        break;
                    case "Once-Period2":
                        let PayType_OP2_Ratio = `合同总价款的${data.PayType_OP2_Ratio}%(${data.PayType_OP2_Money}元)`;
                        if (!data.PayType_OP2_Ratio) {
                            PayType_OP2_Ratio = `${data.PayType_OP2_Money}元`;
                        }
                        content = `本合同签订之日起${data.PayType_OP2_SignDay}日内，买方向卖方支付${PayType_OP2_Ratio}作为预付款，在买方向卖方支付合同约定预付款前，卖方有权拒绝发货并不承担逾期交货的违约责任，同时买方保证在卖方发货之日起${data.PayType_OP2_SendDay}日内付清剩余货款，即${money}元。`;
                        break;
                    default:
                        content = data.PayType_Customize;
                }
                break;
        }

        return content;
    }

    /**根据交付方式返回交付小标题 */
    returnTitleByDeliveryMode(DeliveryMode){
        let title = "";
        switch (DeliveryMode) {
            case "1":
                title = "电子邮件交付";
                break;
            case "2":
                title = "电子邮件+实物交付";
                break;
            default:
                break;
        }
        return title;
    }
}