package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.bcel.generic.Select;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class BotTesting
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		
		driver.get("https://se-project-vmops.slack.com");
		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		String username = "csc510.project.vmops@gmail.com";
		String password = "vmops123";
		email.sendKeys(username);
		pw.sendKeys(password);

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #selenium-bot channel and wait for it to load.
		driver.get("https://se-project-vmops.slack.com/messages/vmops");
		wait.until(ExpectedConditions.titleContains("vmops"));
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
	public void usecase1_1()
	{
		// This is the first test case for the use case 1
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("firecommand uptime");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'firecommand uptime']"));
		assertNotNull(msg);
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = '20:20 up 10 days, 12:53, 2 users, load averages: 3.02 3.08 2.82']")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = '20:20 up 10 days, 12:53, 2 users, load averages: 3.02 3.08 2.82']"));
		System.out.println(response.getText());
		assertNotNull(response.getText());
	
	}
	
	
	@Test
	public void usecase1_2()
	{
		// This is the second test case for the use case 1. 
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("firecommand ansible group_name -i inventory --list-hosts");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'firecommand ansible group_name -i inventory --list-hosts')]"));
		assertNotNull(msg);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'hosts (2)')]")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body'and contains(text(),'hosts (2)')]"));
		
		System.out.println(msg.getText());
		System.out.println(response.getText());
		
		assertNotNull(response.getText());
		
	
	}
	
	
	@Test
	public void usecase2_1()
	{
		// This is the second test case for the use case 1. 
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("merged_version vm1 vm2");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'merged_version vm1 vm2')]"));
		assertNotNull(msg);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(),'list of packages')]")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body'and contains(text(),'list of packages')]"));
		
		System.out.println(msg.getText());
		System.out.println(response.getText());
		
		assertNotNull(response.getText());
		
	
	}
	
	
	@Test
	public void usecase2_2()
	{
		// This is the second test case for the use case 1. 
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("merge vm1 vm2 -a vm3");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'merge vm1 vm2 -a vm3']"));
		assertNotNull(msg);
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = '20:20 up 10 days, 12:53, 2 users, load averages: 3.02 3.08 2.82']")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = '20:20 up 10 days, 12:53, 2 users, load averages: 3.02 3.08 2.82']"));
		
		System.out.println(msg.getText());
		System.out.println(response.getText());
		
		assertNotNull(response.getText());
		
	
	}
	
	@Test
	public void usecase3_1()
	{
		// This is the first test case for the use case 3
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("list_shrinkable");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(), 'list_shrinkable')]"));
		assertNotNull(msg);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(), 'List of shrinkable VMs:')]")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(), 'List of shrinkable VMs:')]"));
		wait.withTimeout(50, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		System.out.println(response.getText());
		assertNotNull(response.getText());
		
	
	}
	
	@Test
	public void usecase3_2()
	{
		// This is the second test case for the use case 3
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("shrinked_version vm3");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(), 'shrinked_version vm3')]"));
		assertNotNull(msg);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(), 'Proposed VM config:')]")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and contains(text(), 'Proposed VM config:')]"));
		
		System.out.println(response.getText());
		assertNotNull(response.getText());
		
	
	}
	
	@Test
	public void usecase3_3()
	{
		// This is the third test case for the use case 3
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("shrink vm3");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(15, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'shrink vm3']"));
		assertNotNull(msg);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = 'VM3 has been shrinked.']")));
		WebElement response = driver.findElement(By.xpath("//*[@id='msgs_div']/div[last()]/div[2]/ts-message[last()]/div[2]/span[@class='message_body' and text() = 'VM3 has been shrinked.']"));
		
		System.out.println(response.getText());
		assertNotNull(response.getText());
		
	
	}

	private int last() {
		// TODO Auto-generated method stub
		return 0;
	}
	

}
