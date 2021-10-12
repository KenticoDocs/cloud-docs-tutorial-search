| [master](https://github.com/KenticoDocs/kontent-docs-tutorial-search/tree/master) | [develop](https://github.com/KenticoDocs/kontent-docs-tutorial-search/tree/develop) |
|:---:|:---:|
| [![Build Status](https://travis-ci.com/KenticoDocs/kontent-docs-tutorial-search.svg?branch=master)](https://travis-ci.com/KenticoDocs/kontent-docs-tutorial-search/branches) [![codebeat badge](https://codebeat.co/badges/42250639-ea84-495e-8a36-2d4eb2584978)](https://codebeat.co/projects/github-com-kenticodocs-kontent-docs-tutorial-search-master) | [![Build Status](https://travis-ci.com/KenticoDocs/kontent-docs-tutorial-search.svg?branch=develop)](https://travis-ci.com/KenticoDocs/kontent-docs-tutorial-search/branches) [![codebeat badge](https://codebeat.co/badges/b493280f-f67c-43fc-8cbe-af39166e4f40)](https://codebeat.co/projects/github-com-kenticodocs-kontent-docs-tutorial-search-develop) |

(https://github.com/KenticoDocs/kontent-docs-tutorial-search/actions/workflows/develop_kcd-search-service-live-dev.yml/badge.svg)

# Kentico Kontent Documentation - Tutorial Search
Backend service for Kentico Kontent [documentation portal](https://docs.kontent.ai/), which utilizes Kentico Kontent as a source of its content.

In order to provide an exquisite search experience, this service is responsible for indexing content of the documentation portal's tutorials.
It responds to events sent by [Dispatcher](https://github.com/KenticoDocs/kontent-docs-dispatcher) and stores the content ready to index on [Algolia](https://www.algolia.com/) in an [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Overview
1. This project is a Typescript Azure Functions application.
2. It is subscribed to an Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) topic and listens for events. Each event contains information about the content that was changed.
3. After receiving an event, it fetches the content from Kentico Kontent using [Kentico Kontent Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js).
4. The fetched content is then split into smaller [Algolia-compatible records](https://www.algolia.com/doc/faq/basics/what-is-a-record/). 
5. Finally the records are stored in an Azure Blob Storage, where the following [Indexing Sync](https://github.com/KenticoDocs/kontent-docs-index-sync) service can access it and update the index on Algolia accordingly.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on MS Azure, Kentico Kontent and Algolia

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Kontent project ID
* `KC.SecuredApiKey` - Kentico Kontent secured delivery API key
* `AzureWebJobsStorage` - Connection string to Azure blob storage
* `Azure.ContainerName` - Azure Storage container name
* `Azure.ClearIndexUrl` - URL of the [`kcd-clear-index` Azure function](https://github.com/KenticoDocs/kontent-docs-index-sync)

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
