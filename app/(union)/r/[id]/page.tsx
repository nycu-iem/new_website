import { redirect } from "next/navigation"

export default function PageRedirect({
    params
}: {
    params: {
        id: string
    }
}) {


    switch(params.id){
        case "2024_summer_camp":
            return redirect("https://www.facebook.com/nctuiemcamp/");
        case "2024_summer_camp_ins":
            return redirect("https://docs.google.com/document/d/14aPVtfRLNavJ3t9oJduHu03nem9VFdM5kg3xjAEdHeE/edit?fbclid=IwZXh0bgNhZW0CMTAAAR0RLBqZLPoo_MTrAogD1bQcd7QRsLh3qCLblOFe4qc6rGD5xqAZzN3D3wo_aem_ATxuHPTTCn8KzQBkK_nwVbpwvg0Rw7jM1q1Qi6_R9pTfBuBP_RozH57gP4559iC8fErsnZEo6uvd8I2gOofrAQMx");
    }
}