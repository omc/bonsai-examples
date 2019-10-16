# frozen_string_literal: true
require 'elasticsearch/model'

class User < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
  settings index: { number_of_shards: 1 }

  validates :first_name, :last_name, :email, :address, :city, :company,
            :zip_code, presence: true
  validates :email, uniqueness: true

#override the default stringification
  def to_s
    "#{first_name} #{last_name}"
  end
end
