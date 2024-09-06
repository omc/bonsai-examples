# frozen_string_literal: true

require 'user_seed'

namespace :seed do
  task users: :environment do
    UserSeed.seed
  end
end
