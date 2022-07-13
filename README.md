![master](https://github.com/Kontent-ai-Learn/kontent-ai-learn-tutorial-search/actions/workflows/master_kcd-search-service-live-master.yml/badge.svg)
![develop](https://github.com/Kontent-ai-Learn/kontent-ai-learn-tutorial-search/actions/workflows/develop_kcd-search-service-live-dev.yml/badge.svg)

# Kontent.ai Learn - Tutorial Search

Backend service for [Kontent.ai Learn](https://kontent.ai/learn/) that uses Kontent.ai as a source of its content.

In order to provide an exquisite search experience, this service is responsible for indexing content of the documentation portal's tutorials.
It responds to events sent by [Dispatcher](https://github.com/Kontent-ai-Learn/kontent-ai-learn-dispatcher) and stores the content ready to index on [Algolia](https://www.algolia.com/) in an [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Overview

1. This project is a Typescript Azure Functions application.
2. It is subscribed to an Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) topic and listens for events. Each event contains information about the content that was changed.
3. After receiving an event, it fetches the content from Kontent.ai using [Kontent.ai Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js).
4. The fetched content is then split into smaller [Algolia-compatible records](https://www.algolia.com/doc/faq/basics/what-is-a-record/).
5. Finally the records are stored in an Azure Blob Storage, where the following [Indexing Sync](https://github.com/Kontent-ai-Learn/kontent-ai-learn-index-sync) service can access it and update the index on Algolia accordingly.

## Setup

### Prerequisites

1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on MS Azure, Kontent.ai, and Algolia

### Instructions

1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys

* `KC.ProjectId` - Kontent.ai project ID
* `KC.SecuredApiKey` - Kontent.ai secured delivery API key
* `AzureWebJobsStorage` - Connection string to Azure blob storage
* `Azure.ContainerName` - Azure Storage container name
* `Azure.ClearIndexUrl` - URL of the [`kcd-clear-index` Azure function](https://github.com/Kontent-ai-Learn/kontent-ai-learn-index-sync)

## Testing

* Run `yarn run test` in the terminal.

## How To Contribute

Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## License

All the source codes are published under MIT license.
