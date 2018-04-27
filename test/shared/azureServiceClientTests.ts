// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import * as msRest from "ms-rest-js";
import { baseURL } from "../testUtils";
import { AzureServiceClient } from "../../lib/msRestAzure";

class TestAzureServiceClient extends AzureServiceClient {
}

describe("AzureServiceClient", () => {
  it("should send requests when using the default Azure HTTP pipeline", async () => {
    const azureServiceClient = new TestAzureServiceClient(new msRest.TokenCredentials("MY-FAKE-TOKEN"));

    const httpRequest = new msRest.HttpRequest({ method: msRest.HttpMethod.GET, url: `${baseURL}/httpbin-index.html` });

    const httpResponse: msRest.HttpResponse = await azureServiceClient.sendRequest(httpRequest);
    assert(httpResponse);

    assert.strictEqual(httpResponse.statusCode, 200);

    assert(httpResponse.headers);
    assert.strictEqual(httpResponse.headers.get("content-length"), "13129");
    assert.strictEqual(httpResponse.headers.get("content-type"), "text/html; charset=UTF-8");
    assert(httpResponse.headers.get("date"));

    const textBody: string = await httpResponse.textBody() as string;
    assert(textBody);
    assert.notStrictEqual(textBody.indexOf(`<html>`), -1);
    assert.notStrictEqual(textBody.indexOf(`httpbin.org`), -1);

    assert.deepEqual(httpResponse.request, httpRequest);
  });
});