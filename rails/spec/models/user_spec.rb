# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, elasticsearch: true, type: :model do
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

  describe 'elasticsearch' do
    it 'should initially have no User records' do
      expect(User.search('*:*').records.length).to eq(0)
    end

    it 'should update ES when the object is created' do
      user = create(:user)
      User.__elasticsearch__.refresh_index!
      expect(User.search("id:#{user.id}").records.length).to eq(1)
    end

    it 'should update ES when the object is destroyed' do
      user = create(:user)
      user.destroy!
      expect(User.search("id:#{user.id}").records.length).to eq(0)
    end

    it 'should return correct results when queried' do
      user_1 = create(:user)
      user_2 = create(:user)
      user_3 = create(:user)

      expect(User.search("first_name:#{user_1.first_name}").records.length).to eq(1)
    end
  end
end
