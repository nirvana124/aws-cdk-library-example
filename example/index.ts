import { App, Construct, StackProps } from "@aws-cdk/core";
import { MyOrgStack } from "../lib";
import { Queue } from "@aws-cdk/aws-sqs";
import { RestApi } from "@aws-cdk/aws-apigateway";
import { Topic } from "@aws-cdk/aws-sns";

class TestStack extends MyOrgStack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Queue(this, 'test-queue', { queueName: 'test-queue' });
        new Topic(this, 'test-topic', { topicName: 'test-topic' })
        const api = new RestApi(this, 'TestRestApi', { cloudWatchRole: false });
        api.root.addMethod('GET');
    }
}

class TestApp extends App {
    constructor() {
        super();
        new TestStack(this, 'org-defaults-example');
    }
}

const cfn = new TestApp();
