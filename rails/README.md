# Rails

This is a demo application for showing how to use the [elasticsearch-rails](https://github.com/elastic/elasticsearch-rails) gem.

## How to Use it Locally

```
git clone git@github.com:omc/bonsai-examples.git
cd bonsai-examples
cd rails
bundle install
yarn install --check-files
bundle exec rake db:{create,migrate}
bundle exec rake seed:users
bundle exec rails s
```
