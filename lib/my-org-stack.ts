import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { MyOrgDefaultsAspect } from "./my-org-defaults-aspects";


export class MyOrgStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)
        this.node.applyAspect(new MyOrgDefaultsAspect())
    }
}
