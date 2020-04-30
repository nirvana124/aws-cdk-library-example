# aws-cdk-library-example
One of the ways to enforce best organization practices while provisioning your infrastructure using AWS CDK.

## How does this library works:
In my lib i have defined a wrapper class(MyOrgStack) on top of Stack class (see : `lib/my-org-stack.ts`).
This stack class only applies Aspect to stak which internally delgates to specific aspects
for each resource to validate ot apply best practices according to my organization.

All the aspects are defined in `lib/my-org-defaults-aspects`. 

## Aspects: 
0. MyOrgDefaultsAspect: Applies specific aspect according to node type.
1. MyOrgQueueDefaultsAspect: Creates DLQ if not attahed to SQS.
Lets say in my org we always defines a dead letter queue for any SQS we create
and as per org standard we add suffix for all the dead letter queue as `DLQ`.

MyOrgQueueDefaultsAspect aspect check if the queue names does not ends with DLQ
than we create a new DLQ for the queue. 

2. MyOrgMethodDefaultsAspect: Warns user to add authorization.
Checks if the httpmethod is not of type options and no authorization is applied to method,
than logs the warning to user saying to apply authorization.

3. MyOrgRestApiDefaultsAspect: Create an output for id of `RestApi`.


## Benfits of using this approach
1. Force consumer to follow best practices by throwing error or logging warning messages.
2. Gives you flexibility to create new resource or change the configuration of resource.
3. Creating aspect per resource will give you flexibility to extend `cdk.Stack` class and apply aspect to single resource.

## Example
You can see in `example/index.ts` inside my TestStack i am defining only 
1. One SQS
2. One SNS
3. One Api gateway having a GET method on root resource.
To syntesize the stack run below commands:
```ts
cd example  // Go to example folder
cdk synth   // Synthesize CFN
```

Now check inside `example/cdk.out/org-defaults-example.template.json` you can observe below:
1. We dined only one SQS but inside template there are 2 SQS.
2. RedrivePolicy of one of the SQS is set as the other SQS.
3. One new Test api output is created.

All this is created because our `TestStack` is extending `MyOrgStack` instead of `Stack`.

Now you can check your console logs where you executed `cdk synth`. You will find following:
`You can configure your defaults for test-topic here.`
`Method orgdefaultsexampleTestRestApiGET0204531E should have autorization`