# frozen_string_literal: true

class User < ApplicationRecord
  validates :first_name, :last_name, :email, :address, :city, :company,
            :zip_code, presence: true
  validates :email, uniqueness: true
end
