# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of :first_name }
    it { is_expected.to validate_presence_of :last_name }
    it { is_expected.to validate_presence_of :email }
    it { is_expected.to validate_uniqueness_of :email }
    it { is_expected.to validate_presence_of :address }
    it { is_expected.to validate_presence_of :city }
    it { is_expected.to validate_presence_of :zip_code }
    it { is_expected.to validate_presence_of :company }
  end
  describe User, search: true do
    
    it "should initally have no user records" do
      assert_equal (0), (User.search('*:*').response["hits"]["total"])
    end

    it "searches" do
      User.create!(first_name: "Tom", last_name: "Smith", email: "example@example.com", address: "1234 Main st", city: "Denver", zip_code: "12345", company: "example inc")
      User.search_index.refresh
      assert_equal ["Tom"], User.search("Tom").map(&:first_name)
    end
  end
end
