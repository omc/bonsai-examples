require "rails_helper"

RSpec.describe User, type: :model do
  describe 'validations' do
    it {should validate_presence_of :first_name}
    it {should validate_presence_of :last_name}
    it {should validate_presence_of :email}
    it {should validate_uniqueness_of :email}
    it {should validate_presence_of :address}
    it {should validate_presence_of :city}
    it {should validate_presence_of :zip_code}
    it {should validate_presence_of :company}
  end
end
