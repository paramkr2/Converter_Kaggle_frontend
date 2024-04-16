# Kaggle Video Converter

This application converts videos pointed to by any URL to HEVC format. 
It utilizes the Kaggle API to convert videos under our own backend . 
To use this application, you need to generate an API token from Kaggle with internet access enabled. 
Unlike using Kaggle through the interface, here you can create more than two running tasks at a time.
Kaggle does some rate limiting, so it may vary how may tasks you can create. 
It only uses CPU time so there is no resource limit issue.
Future release may include GPU enabling disabling option along with wide range of conversion options.


![alt text](https://i.imgur.com/OgRdlOm.png)

## How to Run

1. First, install the dependencies:

```bash
npm install
npm run dev
```

## Repository for backend 

[Converter_Kaggle_Api](https://github.com/paramkr2/Converter_Kaggle_Api)
