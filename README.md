# GitHub docker deploy
With GitHub docker deploy, you can publish a static website from a GitHub repository and have it update automatically.

## Usage
### Build the docker image:
```
docker build -t minie4/github-docker-deploy .
```

### Run the container:
```
docker run -d --name my-website \
  -v my-website:/data \
  -e "REPOSITORY=[your git repo url]" \
  -p 80:80 \
  --restart=always \
  minie4/github-docker-deploy
```

### Get the trigger token:
You can get the trigger token by viewing the container log:
```
docker container logs my-website | grep "Trigger token"
```
or by looking at the token.txt file:
```
docker exec my-website cat /data/token.txt
```

### Set up the WebHook:
Now set up a WebHook that fires a POST request to your server address followed by your trigger token. Example:
```
https://example.com/af4d5229-57a3-4ca0-acbf-11ea689a4d61
```

On GitHub you can do this by navigating to your repository settings and clicking on the "Webhooks" section. Then click "Add webhook" and enter your url and leave all other options unchanged. Then click on "Add webhook" and verify that the test request worked.

If everything has worked, you should now be able to visit your website by accessing the webserver.