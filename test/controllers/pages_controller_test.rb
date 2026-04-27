require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get planning" do
    get pages_planning_url
    assert_response :success
  end
end
