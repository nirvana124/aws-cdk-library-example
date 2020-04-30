import { IAspect, IConstruct, CfnOutput, Resource } from "@aws-cdk/core";
import { CfnQueue, DeadLetterQueue, Queue } from "@aws-cdk/aws-sqs";
import { Topic, CfnTopic } from "@aws-cdk/aws-sns";
import { RestApi, Method, AuthorizationType, CfnMethod } from '@aws-cdk/aws-apigateway';
import { Function, Runtime } from '@aws-cdk/aws-lambda';

export class MyOrgDefaultsAspect implements IAspect {

    visit(node: IConstruct): void {
        if (node instanceof Queue) {
            node.node.applyAspect(new MyOrgQueueDefaultsAspect());
        }

        if (node instanceof Topic) {
            node.node.applyAspect(new MyOrgTopicDefaultsAspect());
        }

        if (node instanceof RestApi) {
            node.node.applyAspect(new MyOrgRestApiDefaultsAspect());
        }

        if (node instanceof Method) {
            node.node.applyAspect(new MyOrgMethodDefaultsAspect());
        }

        if (node instanceof Function) {
            node.node.applyAspect(new MyOrgFunctionDefaultsAspect());
        }
    }
}

export class MyOrgQueueDefaultsAspect implements IAspect {

    visit(node: IConstruct): void {
        if (node instanceof Queue) {
            if (!node.queueName?.endsWith('DLQ')) {
                if (!(node.node.defaultChild as CfnQueue).redrivePolicy) {
                    //create new DLQ for each queue
                    const dlq = this.createDLQ(node);
                    const cfnQueue = node.node.defaultChild as CfnQueue

                    cfnQueue.redrivePolicy = {
                        deadLetterTargetArn: dlq.queue.queueArn,
                        maxReceiveCount: dlq.maxReceiveCount,
                    }
                }
            }
        }
    }


    private createDLQ(node: Queue): DeadLetterQueue {
        return {
            queue: new Queue(node, `TEST-DLQ`, {
                queueName: `${node.queueName}-DLQ`
            }),
            maxReceiveCount: 3
        }
    }
}

export class MyOrgTopicDefaultsAspect implements IAspect {
    visit(node: IConstruct): void {
        if (node instanceof CfnTopic) { // Can also use Topic instead of CfnTopic
            //Apply your best practices here.
            console.log(`You can configure your defaults for ${node.topicName} here.`);
            //You can change existing properties
        }
    }
}

export class MyOrgRestApiDefaultsAspect implements IAspect {

    visit(node: IConstruct): void {
        if (node instanceof RestApi) {
            new CfnOutput(node, `ApiOutput`, {
                exportName: `${node.restApiId}-test-out`,
                description: 'Testing description',
                value: node.restApiId
            })
        }
    }
}

export class MyOrgMethodDefaultsAspect implements IAspect {

    visit(node: IConstruct): void {
        if (node instanceof Method) {
            if (node.httpMethod != 'OPTIONS' &&
                AuthorizationType.NONE == (node.node.defaultChild as CfnMethod).authorizationType) {
                console.log(`Method ${node.node.uniqueId} should have autorization`);
                //throw Error(`Method ${child.node.id} should have autorization enabled`);
            }

        }
    }
}

export class MyOrgFunctionDefaultsAspect implements IAspect {

    visit(node: IConstruct): void {
        if (node instanceof Function) {
            if (node.runtime != Runtime.NODEJS_12_X) {
                console.log('As per organization standards we should use NodeJs12.x as run time')
                //throw Error('As per organization standards we should use NodeJs12.x as run time');
            }
        }
    }
}
