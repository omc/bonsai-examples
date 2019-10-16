# frozen_string_literal: true

require 'user_seed'

namespace :seed do
  task users: :environment do
    User.__elasticsearch__.create_index! force: true
    UserSeed.seed
  end
end
